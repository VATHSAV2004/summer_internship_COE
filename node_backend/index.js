const express = require('express');
const app = express();
const cors = require('cors');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const jwt = require('jsonwebtoken');

app.use(express.json()); // Middleware to parse JSON request bodies

app.use(cors({
  origin: 'http://localhost:3000' // Frontend URL
}));

// Initialize database connection
var db = 0;
const initialiseDb = async () => {
  try {
    db = await open({
      driver: sqlite3.Database,
      filename: "../database/uniproject - Copy.db"
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
initialiseDb();

// JWT Secret Key
const JWT_SECRET = "MY_SECRET_TOKEN";

// Middleware for JWT authentication
const authenticateToken = (request, response, next) => {
  const authHeader = request.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return response.status(401).send('Invalid JWT Token');

  jwt.verify(token, JWT_SECRET, (error, payload) => {
    if (error) return response.status(403).send('Invalid JWT Token');
    request.username = payload.username;
    next();
  });
};

// Register a new student under a university
app.post('/RegisterStudent', async (req, res) => {
  const { student_name, university_id, user_id, password } = req.body;

  const universityCheckQuery = 'SELECT * FROM universities WHERE university_id = ?;';
  const university = await db.get(universityCheckQuery, [university_id]);

  if (!university) {
    res.status(400).send({ message: 'University not found. Registration denied.' });
  } else {
    const insertStudentQuery = 'INSERT INTO students (student_name, university_id, user_id, password) VALUES (?, ?, ?, ?);';
    await db.run(insertStudentQuery, [student_name, university_id, user_id, password]);
    res.send({ message: 'Student registered successfully!' });
  }
});

// Student login
app.post('/StudentLogin', async (req, res) => {
  const { user_id, password } = req.body;
  const query = 'SELECT * FROM students WHERE user_id = ? AND password = ?;';
  const student = await db.get(query, [user_id, password]);

  if (student) {
    const token = jwt.sign({ username: user_id }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: 'Login successful!', token, student_id: student.student_id });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Get all students (secure route)
app.get('/AllStudents', authenticateToken, async (req, res) => {
  const query = 'SELECT * FROM students;';
  const data = await db.all(query);
  res.send(data);
});

// Add a new university
app.post('/AddUniversity', async (req, res) => {
  const { university_name, user_name, password } = req.body;

  const checkQuery = 'SELECT * FROM universities WHERE university_name = ?;';
  const existingUniversity = await db.get(checkQuery, [university_name]);

  if (existingUniversity) {
    res.status(400).send({ message: 'University already exists.' });
  } else {
    const query = 'INSERT INTO universities (university_name, user_name, password) VALUES (?, ?, ?);';
    await db.run(query, [university_name, user_name, password]);
    res.send({ message: 'University added successfully!' });
  }
});

// University login
app.post('/UniversityLogin', async (req, res) => {
  const { user_name, password } = req.body;
  const query = 'SELECT * FROM universities WHERE user_name = ? AND password = ?;';
  const university = await db.get(query, [user_name, password]);

  if (university) {
    const token = jwt.sign({ username: user_name }, JWT_SECRET, { expiresIn: '1h' });
    res.send({ message: 'Login successful!', token });
  } else {
    res.status(401).send({ message: 'Invalid credentials' });
  }
});

// Get projects by student_id (secure route)
app.get('/ProjectsByStudent/:student_id', authenticateToken, async (req, res) => {
  const student_id = req.params.student_id;
  const query = 'SELECT * FROM projects WHERE student_id = ?;';
  
  try {
    const projects = await db.all(query, [student_id]);
    res.send(projects);
  } catch (error) {
    console.error('Error fetching projects by student_id:', error);
    res.status(500).send('An error occurred while fetching projects.');
  }
});



// Verify Token Route
app.get('/verifyToken', authenticateToken, (req, res) => {
  res.status(200).send({ message: 'Token is valid' });
});










app.get('/AllUniversities',async (req,res)=>{
    const query='SELECT * FROM universities;';
    const data=await db.all(query);
    res.send(data);
});
app.get('/CollegeProjects/:collegeId',async (req,res)=>{
    const collegeId=req.params.collegeId
    const query=`SELECT projects.*
    FROM projects
    JOIN students ON projects.student_id = students.student_id
    JOIN universities ON students.university_id = universities.university_id
    WHERE universities.university_id = '${collegeId}';`;
    const data=await db.all(query);
    res.send(data);
});

app.get('/ProjectsDetails/:project_id',async (req,res)=>{
    const project_id=req.params.project_id;
    const query=`SELECT * FROM projects WHERE project_id='${project_id}';'`;
    const data=await db.all(query);
    res.send(data);
});
app.get('/ProjectsDetails/title/:project_title', async (req, res) => {
    const project_title = req.params.project_title;
    const query = `SELECT * FROM projects WHERE project_title LIKE '%${project_title}%';`;
    try {
        const data = await db.all(query);
        res.send(data);
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).send('An error occurred while fetching project details.');
    }
});







app.listen(4860, () => { console.log("Running server at 4860") });
