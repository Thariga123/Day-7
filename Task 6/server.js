const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { body, param, validationResult } = require('express-validator');

const app = express();
const port = 5000;

app.use(express.json());

const uri = "mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB";
const client = new MongoClient(uri);

const studentValidation = [
    body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required'),
    body('age').isNumeric().withMessage('Age must be a number').notEmpty().withMessage('Age is required'),
    body('major').isString().withMessage('Major must be a string').notEmpty().withMessage('Major is required'),
    body('rollNo').isString().withMessage('Roll number must be a string').notEmpty().withMessage('Roll number is required'),
];

const idValidation = [
    param('id').custom((value) => ObjectId.isValid(value)).withMessage('Invalid ObjectId format'),
];


app.post('/students', studentValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const newStudent = req.body;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

        const result = await studentsCollection.insertOne(newStudent);

        res.status(201).json({ message: "Student added successfully", studentId: result.insertedId });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ error: "An error occurred while adding the student" });
    } finally {
        await client.close();
    }
});

app.put('/students/:id', [...idValidation, ...studentValidation], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const studentId = req.params.id;
    const updateData = req.body;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

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

app.delete('/students/:id', idValidation, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const studentId = req.params.id;

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const studentsCollection = database.collection('students');

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
