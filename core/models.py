from typing import List, Optional,Dict,Any
from pydantic import BaseModel, Field


class StoryOptionLLM(BaseModel):
    text: str= Field(description="the text of the option shown to the user")
    nextNode: Dict[str, Any]= Field(description="the next node option and its content")

class StoryNodeLLM(BaseModel):
    content: str= Field(description= "the main content of the story")
    isEnding: bool= Field(description="whether this node is an ending or not")
    isWinningEnding:bool= Field(description="whether this node is a winning ending or not")
    options: Optional[List[StoryOptionLLM]]= Field(default=None, description="the options available from this node")

class StoryLLMResponse(BaseModel):
    title: str= Field(description="the title of the story")
    rootNode: StoryNodeLLM= Field(description="the root node of the story")
                                