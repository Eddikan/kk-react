
// GetUserData.js
import axios from 'axios';

const getPortfolioData = async (currentUser) => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'media?award_id=7');
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching portfolio data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default getPortfolioData;