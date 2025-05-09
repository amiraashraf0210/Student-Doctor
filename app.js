const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 3000;

// Basic setup
app.use(cors());
app.use(express.json());

// Database setup
const dbUrl = "mongodb+srv://amiraashraf0210:amiraashraf0210@cluster0.u3m2tfe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "students_db";
const client = new MongoClient(dbUrl);

// Connect to database
let db;
client.connect()
    .then(() => {
        console.log("Connected to database");
        db = client.db(dbName);
    })
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1);
    });

// Demo student
app.post("/add-hardcoded-student", async (req, res) => {
    try {
        const student = {
            name: "student",
            age: 20,
            level: 1,
            address: "123 Main St"
        };

        const result = await db.collection("students").insertOne(student);
        if (!result.acknowledged) {
            throw new Error("Failed to add student");
        }
        res.status(201).json({ message: "Test student added successfully", student });
    } catch (error) {
        console.error("Error adding demo student:", error);
        res.status(500).json({ error: "Could not add test student", details: error.message });
    }
});

// Students APIs
app.post("/add-student", async (req, res) => {
    try {
        // Validate required fields
        const { name, age, level, address } = req.body;
        if (!name || !age || !level || !address) {
            return res.status(400).json({ error: "All fields (name, age, level, address) are required" });
        }

        // Validate age is a number
        if (isNaN(age) || age < 0 || age > 120) {
            return res.status(400).json({ error: "Age must be a valid number between 0 and 120" });
        }

        const result = await db.collection("students").insertOne(req.body);
        if (!result.acknowledged) {
            throw new Error("Failed to add student");
        }
        res.status(201).json({ message: "Student added successfully", student: req.body });
    } catch (error) {
        console.error("Error adding student:", error);
        res.status(500).json({ error: "Could not add student", details: error.message });
    }
});

app.get("/fetch-students", async (req, res) => {
    try {
        const studentsList = await db.collection("students").find().toArray();
        res.status(200).json(studentsList);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ error: "Could not get students list", details: error.message });
    }
});

app.delete("/delete-student", async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        const result = await db.collection("students").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.status(200).json({ message: "Student removed successfully" });
    } catch (error) {
        console.error("Error deleting student:", error);
        res.status(500).json({ error: "Could not remove student", details: error.message });
    }
});

app.put("/update-student", async (req, res) => {
    try {
        const { id, name, age, level, address } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Student ID is required" });
        }

        // Validate age if provided
        if (isNaN(age) || age < 0 || age > 120) {
            return res.status(400).json({ error: "Age must be a valid number between 0 and 120" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (age) updateData.age = age;
        if (level) updateData.level = level;
        if (address) updateData.address = address;

        console.log(updateData)

        const result = await db.collection("students").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.status(200).json({ message: "Student updated successfully", student: updateData });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Could not update student", details: error.message });
    }
});

// Doctors APIs
app.post("/add-doctor", async (req, res) => {
    try {
        const { name, age, phone } = req.query;

        if (!name || !age || !phone) {
            return res.status(400).json({ error: "All fields (name, age, phone) are required" });
        }

        if (isNaN(age) || age < 0 || age > 120) {
            return res.status(400).json({ error: "Age must be a valid number between 0 and 120" });
        }

        const doctor = {
            name,
            age: parseInt(age),
            phone
        };

        const result = await db.collection("doctors").insertOne(doctor);
        if (!result.acknowledged) {
            throw new Error("Failed to add doctor");
        }
        res.status(201).json({ message: "Doctor added successfully", doctor });
    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({ error: "Could not add doctor", details: error.message });
    }
});

app.get("/fetch-doctors", async (req, res) => {
    try {
        const doctorsList = await db.collection("doctors").find().toArray();
        res.status(200).json(doctorsList);
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ error: "Could not get doctors list", details: error.message });
    }
});

app.delete("/delete-doctor", async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: "Doctor name is required" });
        }

        const result = await db.collection("doctors").deleteOne({ name });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor removed successfully" });
    } catch (error) {
        console.error("Error deleting doctor:", error);
        res.status(500).json({ error: "Could not remove doctor", details: error.message });
    }
});

app.put("/update-doctor", async (req, res) => {
    try {
        const { id, name, age, phone } = req.body;

        if (!id) {
            return res.status(400).json({ error: "Doctor ID is required" });
        }

        // Validate age if provided
        if (age && (isNaN(age) || age < 0 || age > 120)) {
            return res.status(400).json({ error: "Age must be a valid number between 0 and 120" });
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (age) updateData.age = age;
        if (phone) updateData.phone = phone;

        const result = await db.collection("doctors").updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Doctor not found" });
        }
        res.status(200).json({ message: "Doctor updated successfully", doctor: updateData });
    } catch (error) {
        console.error("Error updating doctor:", error);
        res.status(500).json({ error: "Could not update doctor", details: error.message });
    }
});

// Get all data
app.get("/fetch-all", async (req, res) => {
    try {
        const [studentsList, doctorsList] = await Promise.all([
            db.collection("students").find().toArray(),
            db.collection("doctors").find().toArray()
        ]);
        res.status(200).json({
            students: studentsList,
            doctors: doctorsList
        });
    } catch (error) {
        console.error("Error fetching all data:", error);
        res.status(500).json({ error: "Could not get data", details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});