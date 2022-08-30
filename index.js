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
app.use(express.static(path.join(__dirname, 'client/build')))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')))
}

/*****ROUTES******/

//Browse routes
app.use('/api/v1/browse', require('./src/routes/browse'));

//Auth routes
app.use('/api/v1/auth', require('./src/routes/authRoutes'));

//Portfolio routes
app.use('/api/v1/portfolio', require('./src/routes/portfolio'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})

app.get('/*', (req, res) => {
    res.sendFile('/client/build/index.html', {root: __dirname});
})
