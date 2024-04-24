const express = require("express");
const mongoose = require("mongoose"); 
const bodyparser = require("body-parser");
const nodemailer = require("nodemailer");


const app = express();// server method
// to set  port number
app.listen(5000,function(){
    console.log('server is running successful');
});
app.use(bodyparser.urlencoded({ extended: true }));




mongoose.connect("mongodb://localhost:27018/Attendance_Management", {
  
  
}).then(() => {
    console.log("Connection successful");
}).catch((error) => {
    console.error("Connection failed:", error);
});


// to set server engine
app.set("view engine", "ejs");
app.get("/",(req,res)=>{
    res.render("index")
});

//set server register get page
app.get("/adminlogin", (req, res) => {
    res.render("adminlogin");
});

// To validate admin login




//to get adminhome page
app.get("/adminhome", (req, res) => {
    res.render("adminhome"); // Assuming "adminhome" is the name of your EJS view file
});


app.get("/student", (req, res) => {
    res.render("student"); // Assuming "adminhome" is the name of your EJS view file
});

app.get("/stafflogin", (req, res) => {
    res.render("stafflogin"); // Assuming "adminhome" is the name of your EJS view file
});

app.get("/staffregister", (req, res) => {
    res.render("staffregister"); // Assuming "adminhome" is the name of your EJS view file
});

app.get("/addstudents", (req, res) => {
    res.render("addstudentS");
});

app.get("/deleteevents", (req, res) => {
    res.render("deleteeventS");
});

app.get("/studenthome", (req, res) => {
    res.render("studenthome");
});

const eventSchema = new mongoose.Schema({
    eventName: { type: String, required: true },
    eventDate: { type: Date, required: true },
    eventLocation: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;

// Express route to render add events form
app.get('/addevents', (req, res) => {
    res.render('addevents'); // Assuming you have a corresponding EJS file
});

// Express route to handle form submission and add event to MongoDB
app.post('/addevents', async (req, res) => {
    const { eventName, eventDate, eventLocation } = req.body;
    const newEvent = new Event({ eventName, eventDate, eventLocation });
    try {
        await newEvent.save();
        res.redirect('/viewevents'); // Assuming you have a route for viewing events
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).send('Error adding event');
    }
});
app.post('/deleteevent/:id', async (req, res) => {
    const eventId = req.params.id;
    try {
        // Find the event by ID and delete it
        await Event.findByIdAndDelete(eventId);
        res.redirect('/viewevents'); // Redirect to view events page after deletion
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).send('Error deleting event');
    }
});
// Express route to render view events page
app.get('/viewevents', async (req, res) => {
    try {
        const events = await Event.find();
        res.render('viewevents', { events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).send('Error fetching events');
    }
});


// create modal class
const registerSchema = {

    fullname:String,
    username:String,
    mobile:Number,
    email:String,
    password:String,

    status: {
        type: String,
        default: "inactive"
    }
};
const Register =  mongoose.model("sams",registerSchema)

//set server register post page
app.post("/staffregister",(req,res ) => {

    console.log(req.body.fullname);
    console.log(req.body.email);
    console.log(req.body.password);
    console.log(req.body.username);
    console.log(req.body.mobile);
 
    // send data to database
    const reg = new Register({
        fullname: req.body.fullname,
        username : req.body.username,
        password : req.body.password,
        email: req.body.email,
        mobile : req.body.mobile,

        
    });
    reg.save().then(()=>{
        console.log("data stored")
        // sending mail
        var sentinfo = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"msk498767@gmail",
                pass:"pckk aeul cbvf prbz",
            }
        });
        var sendMessage ={
            from:'msk498767@gmail.com',
            to: req.body.email,
            subject:'good morning',
            text:'50% Off'
        };
        sentinfo.sendMail(sendMessage, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                res.status(500).send('Error sending email');
            } else {
                console.log('Email sent:', info.service);
                res.send('Email sent successfully');
            }
        });
    }).catch(()=>{
        console.log ("not saved")
    });
});

// server login page

app.post("/stafflogin", async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    // Extract email and password from request body
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await Register.findOne({ email });

        if (!user) {
            console.log("Login Failed: User not found");
            return res.status(401).send("Login Failed: User not found");
        }

        // Compare passwords
        if (user.password === password) {
            console.log("Login Success");
            return res.render("staffhome"); // Assuming "staffhome" is the correct template to render
        } else {
            console.log("Login Failed: Incorrect password");
            return res.status(401).send("Login Failed: Incorrect password");
        }
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).send("Login Error");
    }
});


// student login
const schema1 = new mongoose.Schema({
    username: String,
    password: String
});

// Define model
//const Student = mongoose.model('Student', schema1);

// Student Login Route
app.post('/student', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the student by username
        const student = await Student.findOne({ username });

        if (!student) {
            console.log("Login Failed: User not found");
            return res.status(401).send("Login Failed: User not found");
        }

        // Check password
        if (student.password !== password) {
            console.log("Login Failed: Incorrect password");
            return res.status(401).send("Login Failed: Incorrect password");
        }

        console.log("Login Success");
        res.render("studenthome"); // Assuming you have a view engine setup
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Login Error");
    }
});

// Admin Login
// Define schema
const schema = new mongoose.Schema({
    username: String,
    password: String
});

// Define model
const Login = mongoose.model("admin1", schema);

app.post("/adminlogin", async (req, res) => {
    console.log(req.body.username);
    console.log(req.body.password);

    // Create object to store username and password
    const username = req.body.username.trim(); // Trim whitespace
    const password = req.body.password;

    try {
        // Check username availability
        const user = await Login.findOne({ username: username });

        if (!user) {
            console.log("Login Failed: User not found");
            res.status(401).send("Login Failed: User not found");
            return;
        }

        // Check password
        if (user.password === password) {
            console.log("Login Success");
            res.render("adminhome"); // Assuming you have a view engine setup
        } else {
            console.log("Login Failed: Incorrect password");
            res.status(401).send("Login Failed: Incorrect password");
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send("Login Error");
    }
});


// Add Student
// Define the schema for student
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    sequence_value: { type: Number, default: 1 }
});

const Counter = mongoose.model('Counter', counterSchema);

const studentSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    username: { type: String, required: true },
    mobile: {
        type: Number,
        required: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    courseyear: { type: Number, required: true },
    department: { type: String, required: true }
});

// Middleware to auto-increment studentId
studentSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next();
    }

    try {
        const counter = await Counter.findOneAndUpdate({ _id: 'studentId' }, { $inc: { sequence_value: 1 } }, { new: true, upsert: true });
        this.studentId = counter.sequence_value.toString().padStart(6, '0'); // Assuming studentId is 6 digits
        next();
    } catch (error) {
        next(error);
    }
});



const Student = mongoose.model('Student', studentSchema);
// Route handler to add student
app.post('/addstudents', async (req, res) => {
    try {
        const { fullname, username, mobile, email, password, courseyear, department } = req.body;

        // Check if the username already exists
        const existingStudent = await Student.findOne({ username });
        if (existingStudent) {
            console.log('Username already exists');
            return res.status(400).send('Username already exists');
        }

        // Hash the password
    

        // Create a new student instance
        const newStudent = new Student({
            fullname,
            username,
            mobile,
            email,
            password,
            courseyear,
            department
        });

        // Save the new student to the database
        await newStudent.save();

        console.log('Student added successfully');
        res.send('Student added successfully');
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).send('Error adding student');
    }
});





// marks ---------------------------------------------------
const markSchema = new mongoose.Schema({
    studentName: String,
    subject1: Number,
    subject2: Number,
    subject3: Number
  });
  
  // Create model
  const Mark = mongoose.model('Mark', markSchema);
app.get('/marks', async (req, res) => {
    const marks = await Mark.find();
    res.render('marks', { marks });
  });
  
  app.post('/marks', async (req, res) => {
    const { studentName, subject1, subject2, subject3 } = req.body;
    const mark = new Mark({
      studentName,
      subject1,
      subject2,
      subject3
    });
    await mark.save();
    res.redirect('/');
  });

  //viewing marks in admin home page

  // Route for rendering the "viewmarks" page
app.get('/viewmarks', async (req, res) => {
    try {
        // Fetch marks data from the database
        const marks = await Mark.find();

        // Render the "viewmarks" EJS template and pass marks data
        res.render('viewmarks', { marks });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).send('Error fetching marks');
    }
});
//view students list
const studentSchemaa = new mongoose.Schema({
    fullname: String,
    username: String,
    mobile: String,
    department: String
});

const Student1 = mongoose.models.Student || mongoose.model('students', studentSchemaa);


app.get('/studentlist', async (req, res) => {
    try {
        // Fetch all students from the database
        const students = await Student.find();

        // Render the viewstudentslist EJS template and pass student data
        res.render('studentlist', { students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});




// Define a Mongoose schema for staff members
const staffSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    mobile: String
    
  });
  
  // Create a Mongoose model based on the schema for the "sams" collection
  const Staff = mongoose.model('Staff', staffSchema, 'sams');
  
// Route to fetch staff members and render EJS file
app.get('/stafflist', async (req, res) => {
    try {
      // Fetch staff members data from the "sams" collection
      const staffMembers = await Staff.find();
  
      // Render the EJS file with staff members data
      res.render('stafflist', { staffMembers });
    } catch (error) {
      console.error('Error fetching staff members:', error);
      res.status(500).send('Error fetching staff members');
    }
  });
  
// Route to render the update form
app.get('/updatestaffstatus', (req, res) => {
    res.render('updatestaffstatus');
});

// Route to handle form submission and update staff information

app.post('/update', async (req, res) => {
    const { username, status } = req.body;

    try {
        // Find the staff member by username and update their status
        const updatedStaff = await Staff.findOneAndUpdate(
            { username: username },
            { status: status },
            { new: true } // Return the updated document
        );

        console.log("Staff information updated:", updatedStaff);
        res.send('Staff information updated successfully!');
    } catch (error) {
        console.error('Error updating staff information:', error);
        res.status(500).send('An error occurred while updating staff information.');
    }
});
// Route handler to render addattendance.ejs template
app.get('/addattendance', (req, res) => {
    res.render('addattendance');
});
// Route handler to add attendance


 

// Route handler for handling search requests
app.get('/search', async (req, res) => {
    const searchQuery = req.query.search; // Get the search query from the request query parameters

    try {
        // Fetch marks data from MongoDB based on the search query
        const filteredMarks = await StudentMark.find({ studentName: { $regex: searchQuery, $options: 'i' } });
        
        // Render the viewmarks template with the filtered marks
        res.render('viewmarks', { marks: filteredMarks });
    } catch (error) {
        console.error('Error fetching marks:', error);
        res.status(500).send('Error fetching marks');
    }
});

const assignmentSchema = new mongoose.Schema({
    assignmentName: { type: String, required: true },
    startDate: { type: Date, required: true },
    lastDate: { type: Date, required: true }
});

// Create a model for assignments using the schema
const Assignment = mongoose.model('Assignment', assignmentSchema);

// Route to render assignment form
app.get('/addassignments', (req, res) => {
    res.render('addassignments');
});

// Route to handle assignment form submission
app.post('/addassignments', async (req, res) => {
    const { assignmentName, startDate, lastDate } = req.body;
    try {
        // Create a new assignment instance
        const newAssignment = new Assignment({
            assignmentName,
            startDate,
            lastDate
        });
        // Save the assignment to the database
        await newAssignment.save();
        res.redirect('/viewassignments');
    } catch (error) {
        console.error('Error adding assignment:', error);
        res.status(500).send('Error adding assignment');
    }
});

// Route to render view assignments page
app.get('/viewassignments', async (req, res) => {
    try {
        // Retrieve all assignments from the database
        const assignments = await Assignment.find();
        res.render('viewassignments', { assignments });
    } catch (error) {
        console.error('Error fetching assignments:', error);
        res.status(500).send('Error fetching assignments');
    }
});
const attendanceSchema = new mongoose.Schema({
    studentName: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true }
  });
  
  const Attendance = mongoose.model('Attendance', attendanceSchema);
 // Assuming you are rendering the at.ejs template in a route handler
app.get('/at', async (req, res) => {
    try {
        // Fetch students data from MongoDB or any other data source
        const students = await Student.find(); // Assuming you have a Student model

        // Render the at.ejs template and pass the students data
        res.render('at', { students: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

  

// Render the attendance page
app.get('/attendance', async (req, res) => {
    try {
        // Fetch students data from MongoDB or any other data source
        const students = await Student.find();

        // Render the at.ejs template and pass the students data
        res.render('at', { students: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).send('Error fetching students');
    }
});

// Handle attendance submission


app.post('/attendance', async (req, res) => {
    const { studentName, status } = req.body;
    console.log('Received attendance data:', req.body); // Log request body
    try {
        // Save attendance to the database
        const newAttendance = new Attendance({ studentName, status });
        await newAttendance.save();
        res.redirect('/attendance');
    } catch (err) {
        console.error('Error adding attendance:', err);
        res.status(500).send('Error adding attendance');
    }
});

app.get('/viewattendance', async (req, res) => {
    try {
        // Fetch attendance records from the database
        const attendanceRecords = await Attendance.find();

        // Render the template and pass the attendance data
        res.render('viewattendance', { attendanceRecords: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).send('Error fetching attendance');
    }
});

  