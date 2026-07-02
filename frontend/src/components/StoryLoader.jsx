import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingStatus from './LoadingStatus';
import StoryGame from './StoryGame';
import { API_BASE_URL } from '../utils';
function StoryLoader() {

    const {id}= useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const loadStory = useCallback(async (storyId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`);
            setStory(response.data);
        }
        catch (err) {
            if (err.response?.status === 404) {
                setError('Story not found');
            }
            else {
                setError('Failed to load story');
            }
        }
        finally {
            setLoading(false);
        }
    }, []);
    useEffect(() => {
        loadStory(id);
    }, [id, loadStory]);
    const createNewStory=async () => {
        navigate('/');
    }
    if (loading){
        return <LoadingStatus theme={""}/>;
    }
    if (error) {
        return (
            <div className="story-loader">
                <div className="error-message">
                    <h2>Story Not Found</h2>
                    <p>{error}</p>
                    <button onClick={createNewStory}>Go To Story Generator</button>
                </div>
            </div>
        )
    }
    if (story){
        return(
            <div className="story-loader">

            <StoryGame story={story} onNewStory={createNewStory}/>
            </div>
        )
    }
}

export default StoryLoader