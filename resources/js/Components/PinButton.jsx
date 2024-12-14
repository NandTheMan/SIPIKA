import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';

const PinButton = ({ classroomId, isPinned: initialPinned = false, onPinChange }) => {
    const [isPinned, setIsPinned] = useState(initialPinned);
    const [isLoading, setIsLoading] = useState(false);

    const handleTogglePin = async () => {
        setIsLoading(true);
        try {
            if (isPinned) {
                await axios.post('/api/classrooms/unpin', { classroom_id: classroomId });
            } else {
                await axios.post('/api/classrooms/pin', { classroom_id: classroomId });
            }
            setIsPinned(!isPinned);
            if (onPinChange) {
                onPinChange(!isPinned);
            }
        } catch (error) {
            console.error('Error toggling pin:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleTogglePin}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
                isPinned
                    ? 'text-red-500 hover:bg-red-50'
                    : 'text-gray-400 hover:bg-gray-50'
            }`}
        >
            <Heart className={`w-5 h-5 ${isPinned ? 'fill-current' : ''} ${
                isLoading ? 'animate-pulse' : ''
            }`} />
        </button>
    );
};

export default PinButton;
