// Create a new file: resources/js/services/bookingService.js
import axios from 'axios';
import moment from 'moment';

export const checkRoomAvailability = async (roomId, date, time, duration = 2) => {
    try {
        const dateString = moment(date).format('YYYY-MM-DD');
        const timeString = moment(time).format('HH:mm');

        const response = await axios.post('/book-room/check-availability', {
            roomId,
            date: dateString,
            time: timeString,
            duration
        });

        console.log('Availability check response:', response.data);
        return response.data;

    } catch (error) {
        console.error('Error checking room availability:', error);
        if (error.response) {
            console.log('Error response:', error.response.data);
        }
        throw error;
    }
};

export const getRoomDetails = async (roomId) => {
    try {
        const response = await axios.get(`/book-room/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching room details:', error);
        if (error.response) {
            console.log('Error response:', error.response.data);
        }
        throw error;
    }
};
