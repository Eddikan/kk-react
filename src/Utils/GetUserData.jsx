// GetUserData.js
import axios from 'axios';
import { useCookies } from 'react-cookie';

const GetUserData = async (data) => {
    const currentUser = data.currentUser;
    const token = data.token;

    try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'user/' + currentUser+'?user_id='+currentUser+'&token='+token);
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching user data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default GetUserData;