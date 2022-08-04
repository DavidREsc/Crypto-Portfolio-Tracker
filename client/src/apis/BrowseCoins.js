import axios from 'axios';

// Coin data route
export default axios.create({
    baseURL: '/api/v1/browse'
});
