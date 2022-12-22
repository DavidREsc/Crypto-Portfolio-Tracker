import axios from 'axios'

// Transactions route
export default axios.create({
    baseURL: '/api/v1/transactions'
})
