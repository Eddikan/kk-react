
// GetUserData.js
import axios from 'axios';

const GetProductsData = async () => {
    try {
        const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'portfolio_item');
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching portfolio data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default GetProductsData;