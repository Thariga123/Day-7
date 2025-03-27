const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 4000;


app.use(express.json());


const uri = "mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB";
const client = new MongoClient(uri);


app.put('/students/:id', async (req, res) => {
    const studentId = req.params.id;
    const updateData = req.body;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const duplicateRollNo = await studentsCollection.findOne({
            rollNo: updateData.rollNo,
            _id: { $ne: new ObjectId(studentId) }, 
        });

        if (duplicateRollNo) {
            return res.status(400).json({ error: "Roll number already exists" });
        }

        
        const result = await studentsCollection.updateOne(
            { _id: new ObjectId(studentId) }, 
            { $set: updateData }            
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student updated successfully" });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: "An error occurred while updating the student" });
    } finally {
        await client.close();
    }
});

app.get('/students/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

        const student = await studentsCollection.findOne({ _id: new ObjectId(studentId) });

        if (student) {
            res.json(student);
        } else {
            res.status(404).json({ error: "Student not found" });
        }
    } catch (error) {
        console.error('Error retrieving student:', error);
        res.status(500).json({ error: "An error occurred while retrieving the student" });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
