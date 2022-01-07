require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

/*****ROUTES******/

//Browse routes
app.use('/api/v1/browse', require('./routes/browse'));

//Auth routes
app.use('/api/v1/auth', require('./routes/auth'));


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})
