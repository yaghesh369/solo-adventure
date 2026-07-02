from sqlalchemy.orm import Session
from core.models import StoryLLMResponse, StoryNodeLLM
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.output_parsers import PydanticOutputParser
from langchain_core.language_models.chat_models import BaseChatModel
from langchain_groq import ChatGroq
from core.prompts import STORY_PROMPT, JSON_STRUCTURE
from core.config import settings
from models.story import Story, StoryNode


class StoryGenerator:

    @classmethod
    def _get_llm(cls) -> BaseChatModel:
        return ChatGroq(
            model=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            timeout=120,
            max_retries=2,
        )

    @classmethod
    def generate_story(cls, db: Session, session_id: str, theme: str = "fantasy") -> Story:
        llm = cls._get_llm()
        story_parser = PydanticOutputParser(pydantic_object=StoryLLMResponse)
        messages = [
            SystemMessage(content=STORY_PROMPT.format(format_instructions=JSON_STRUCTURE)),
            HumanMessage(content=f"create a story with this theme: {theme}"),
        ]

        last_error = None
        for attempt in range(3):
            try:
                raw_response = llm.invoke(messages)
                response_text = getattr(raw_response, "content", None)

                if not response_text or not response_text.strip():
                    raise ValueError("Empty response from LLM")

                story_structure = story_parser.parse(response_text)
                story_db = Story(title=story_structure.title, session_id=session_id)
                db.add(story_db)
                db.flush()
                root_node_data = story_structure.rootNode
                if isinstance(root_node_data, dict):
                    root_node_data = StoryNodeLLM.model_validate(root_node_data)
                cls._process_story_node(db, story_db.id, root_node_data, is_root=True)
                db.commit()
                return story_db
            except Exception as e:
                last_error = e
                continue

        raise RuntimeError(
            f"Failed to generate story after 2 attempts: {last_error}"
        )

    @classmethod
    def _process_story_node(
        cls, db: Session, story_id: int, node_data: StoryNodeLLM, is_root: bool = False
    ) -> StoryNode:
        node = StoryNode(
            story_id=story_id,
            content=node_data.content,
            is_root=is_root,
            is_ending=node_data.isEnding,
            is_winning_ending=node_data.isWinningEnding,
            options=[],
        )
        db.add(node)
        db.flush()
        if not node.is_ending and node_data.options:
            options_list = []
            for option_data in node_data.options:
                next_node = option_data.nextNode
                if isinstance(next_node, dict):
                    next_node = StoryNodeLLM.model_validate(next_node)
                child_node = cls._process_story_node(
                    db, story_id, next_node, is_root=False
                )
                options_list.append({
                    "text": option_data.text,
                    "node_id": child_node.id,
                })
            node.options = options_list

        db.flush()
        return node


