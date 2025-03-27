const express = require('express');
const mongoose = require('mongoose');
const Student = require('./routes/schemastudent'); 

const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://thariga:Db4K5szSn4Yesw1l@studentdb.jo4otpt.mongodb.net/DEMO?retryWrites=true&w=majority&appName=studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Database connection error:', err));

app.get('/students', async (req, res) => {
    try {
        const students = await Student.find(); 
        res.status(200).json(students); 
    } catch (err) {
        res.status(500).send('Error retrieving student data');
    }
});

app.post('/students', async (req, res) => {
  const { name, age, grade } = req.body;

 
  if (!name || !age || !grade) {
      return res.status(400).send('Missing required fields: name, age, or grade.');
  }

  try {
      
      const newStudent = new Student({ name, age, grade });
      await newStudent.save(); 
      res.status(201).json(newStudent); 
  } catch (err) {
      res.status(500).send('Error adding student to the database');
  }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});







