const mongoose = require('mongoose');


const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    major: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true }, 
});

module.exports = mongoose.model('Student', studentSchema);