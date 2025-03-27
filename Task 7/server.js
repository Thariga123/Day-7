const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 2000;

app.use(express.json());


const uri = "mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB";
const client = new MongoClient(uri);


app.get('/students', async (req, res) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        
        const totalStudents = await studentsCollection.countDocuments();
        const totalPages = Math.ceil(totalStudents / limit);

        
        if (page < 1 || page > totalPages) {
            return res.status(400).json({ error: "Page number is out of range" });
        }

        const students = await studentsCollection.find()
            .skip((page - 1) * limit)
            .limit(limit)
            .toArray();

        
        res.json({
            students,
            currentPage: page,
            totalPages,
            totalStudents
        });
    } catch (error) {
        console.error('Error retrieving students:', error);
        res.status(500).json({ error: "An error occurred while retrieving students" });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
