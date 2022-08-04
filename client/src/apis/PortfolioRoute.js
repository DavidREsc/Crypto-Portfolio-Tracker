import axios from 'axios';

// Portfolio data route
export default axios.create({
    baseURL: '/api/v1/portfolio'
});
