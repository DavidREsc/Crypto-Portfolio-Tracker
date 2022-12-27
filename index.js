require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
}

/*****ROUTES******/

//Browse routes
app.use('/api/v1/coins', require('./src/routes/coinsRoutes'));

//Auth routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));

//Portfolios routes
app.use('/api/v1/portfolios', require('./src/routes/portfoliosRoutes'));

//Transactions routes
app.use('/api/v1/transactions', require('./src/routes/transactionsRoutes'))

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

app.get('/*', (req, res) => {
    res.sendFile('/client/build/index.html', {root: __dirname});
})
