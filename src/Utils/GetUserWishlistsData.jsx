
// GetUserData.js
import axios from 'axios';

const GetUserWishlistsData = async (data) => {
    const currentUser = data.currentUser;
    const token = data.token;
    try {
        const response = await axios.get(process.env.REACT_APP_API_ENDPOINT + 'user/'+currentUser+'/wishlist?user_id='+currentUser+'&token='+token);
        return response.data.data;
    } catch (error) {
        // Handle the error or show a toast message
        console.error('Error fetching wishlist data:', error);
        throw error; // Optionally, rethrow the error if you want to handle it in the component
    }
};

export default GetUserWishlistsData;