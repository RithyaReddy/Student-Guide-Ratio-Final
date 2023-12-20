// / / / server.js;
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost/students_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Student model
const Student = mongoose.model("Student", {
  studentName: String,
  guideName: String,
  // Add other fields as needed
});

// Define Guide model
const Guide = mongoose.model("Guide", {
  guideName: String,
  type: String,
  currentStudentsAllotted: Number,
});

// API endpoint to get students-to-guide ratio
app.get("/api/ratio", async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalGuides = await Guide.countDocuments();

    const ratio = totalStudents / totalGuides;
    res.json({
      ratio,
      totalStudents,
      totalGuides,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// API endpoint to get guide(s) with the maximum number of students
app.get("/api/max-guides", async (req, res) => {
  try {
    const guides = await Guide.find()
      .sort({ currentStudentsAllotted: -1 })
      .limit(1);
    res.json(guides);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
