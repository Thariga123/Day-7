const Student = require('../models/Student');

const addStudent = async (req, res) => {
  const { name, age, major, rollNo } = req.body;

  if (!name || !age || !major || !rollNo) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(409).json({ error: 'Roll number already exists' });
    }

 
    const newStudent = new Student({ name, age, major, rollNo });

    await newStudent.save();

    const studentDetails = newStudent.toObject();


    res.status(201).json({
      message: 'Student created successfully',
      student: studentDetails
    });

  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addStudent };
 