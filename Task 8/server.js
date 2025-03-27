const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 1000;


app.use(express.json());


const uri = "mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB";
const client = new MongoClient(uri);

app.post('/students', async (req, res) => {
    const newStudent = req.body;

  
    if (!newStudent.name || !newStudent.age || !newStudent.major || !newStudent.rollNo) {
        return res.status(400).json({ error: "All fields (name, age, major, rollNo) are required" });
    }

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        const result = await studentsCollection.insertOne(newStudent);
        res.status(201).json({
            message: "Student added successfully",
            studentId: result.insertedId
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: "An error occurred while adding the student" });
    } finally {
        await client.close();
    }
});



app.get('/students/search', async (req, res) => {
    const query = req.query.q; 

    if (!query) {
        return res.status(400).json({ error: "Search query parameter 'q' is required" });
    }

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        
        const regex = new RegExp(query, 'i'); 
        const students = await studentsCollection.find({
            $or: [
                { rollNo: { $regex: regex } },
                { _id: { $regex: regex } }
            ]
        }).toArray();

        if (students.length === 0) {
            return res.json({ students: [], message: "No matching students found" });
        }

        res.json({ students });
    } catch (error) {
        console.error('Error searching students:', error);
        res.status(500).json({ error: "An error occurred while searching for students" });
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
