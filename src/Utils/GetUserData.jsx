// GetUserData.js
import axios from 'axios';

const getUserData = async (currentUser) => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/' + currentUser);
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching user data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default getUserData;