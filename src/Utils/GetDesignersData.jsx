
// GetUserData.js
import axios from 'axios';

const GetDesignersData = async (currentUser) => {
    try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'designer');
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching portfolio data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default GetDesignersData;