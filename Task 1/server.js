const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();


app.use(express.json());
app.use(cors());


app.use('/students', studentRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
