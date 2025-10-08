const express = require("express");
const app = express();
const path = require("path");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory student data
let students = [
  { name: "Darshan", rollNumber: "101", course: "CSE" },
  { name: "Pranay", rollNumber: "102", course: "IT" },
];

// ---------- ROUTES ----------

// ✅ GET all students
app.get("/api/students", (req, res) => {
  res.json(students);
});

// ✅ GET student by roll number
app.get("/api/students/:rollNumber", (req, res) => {
  const student = students.find(s => s.rollNumber === req.params.rollNumber);
  if (!student) {
    return res.status(404).json({ message: "❌ Student not found." });
  }
  res.json(student);
});

// ✅ ADD a new student
app.post("/api/students", (req, res) => {
  const { name, rollNumber, course } = req.body;

  if (!name || !rollNumber || !course) {
    return res.status(400).json({ message: "⚠️ Please provide all fields (name, rollNumber, course)." });
  }

  if (students.find(s => s.rollNumber === rollNumber)) {
    return res.status(400).json({ message: "🚫 Student with this roll number already exists." });
  }

  students.push({ name, rollNumber, course });
  res.status(201).json({ message: "✅ Student added successfully." });
});

// ✅ UPDATE student (by roll number)
app.put("/api/students", (req, res) => {
  const { name, rollNumber, course } = req.body;

  if (!rollNumber) {
    return res.status(400).json({ message: "⚠️ Roll number is required to update a student." });
  }

  const student = students.find(s => s.rollNumber === rollNumber);
  if (!student) {
    return res.status(404).json({ message: "❌ Student not found." });
  }

  if (name) student.name = name;
  if (course) student.course = course;

  res.json({ message: "✅ Student updated successfully." });
});

// ✅ DELETE student (by name or roll number)
app.delete("/api/students", (req, res) => {
  const { name, rollNumber } = req.body;

  if (!name && !rollNumber) {
    return res.status(400).json({ message: "⚠️ Please provide either name or roll number to delete." });
  }

  const index = students.findIndex(s => s.rollNumber === rollNumber || s.name === name);
  if (index === -1) {
    return res.status(404).json({ message: "❌ Student not found." });
  }

  const deleted = students.splice(index, 1);
  res.json({ message: `🗑️ Deleted: ${deleted[0].name} (${deleted[0].rollNumber}).` });
});

// ---------- ERROR HANDLER ----------
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// ---------- SERVER START ----------
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`⚡ Server running at http://localhost:${PORT}`)
);
