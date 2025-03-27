const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 6000;


app.use(express.json());

const uri = "mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB";
const client = new MongoClient(uri);

app.delete('/students/:id', async (req, res) => {
    const studentId = req.params.id;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        
        if (!ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Invalid ObjectId format" });
        }

       
        const result = await studentsCollection.deleteOne({ _id: new ObjectId(studentId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: "An error occurred while deleting the student" });
    } finally {
        await client.close();
    }
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
