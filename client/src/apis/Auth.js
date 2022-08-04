import axios from "axios";

// Authentication route
export default axios.create({
    baseURL: '/api/v1/auth'
});
