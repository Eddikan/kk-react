// GetCustomerData.jsx
import axios from 'axios';

const getCustomerData = async (currentUser) => {

    try {
        const response = await axios.get(import.meta.env.VITE_REACT_APP_API_ENDPOINT + 'customer?user_id='+currentUser);
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching user data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default getCustomerData;