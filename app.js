const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
//const jwt = require("jsonwebtoken");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const cors = require("cors")

const app = express();
app.use(express.json());
app.use(cors())

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:ValliDhevasenaPathi12!@cluster0.pj5wu5k.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create User schema
const userSchema = new mongoose.Schema({
  name: { type: String,  name : String },
  password: { type: String,  password : String },
  email: { type: String,  email : String },
  apiKey: { type: String, apiKey : String },
  apiKeyExpiry: { type: Date,  apiKeyExpiry : Date },
});

const User = mongoose.model("User", userSchema);

// Helper function to hash passwords
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Endpoint to register a user
app.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Check if the username is already registered
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.status(400).json({ message: "Username already registered" });
    }

    // Generate API key and expiry date
    const apiKey = uuidv4().substring(0,10);
    const apiKeyExpiry = new Date();
    apiKeyExpiry.setFullYear(apiKeyExpiry.getFullYear() + 1);

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create a new user object
    const user = new User({
      name,
      password: hashedPassword,
      email,
      apiKey,
      apiKeyExpiry,
    });

    // Save the user to the database
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error occurred during user registration:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to authenticate the user and retrieve user details
app.post("/user/authenticate", async (req, res) => {
  try {
    const { apiKey } = req.body;

    // Find the user by the API key
    const user = await User.findOne({ apiKey });
    if (!user) {
      return res.status(401).json({ message: "Invalid API key" });
    }

    // Check if the API key has expired
    const currentDateTime = new Date();
    if (user.apiKeyExpiry < currentDateTime) {
      return res.status(401).json({ message: "API key expired" });
    }

    return res.status(200).json({ name: user.name });
  } catch (error) {
    console.error("Error occurred during authentication:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Swagger UI setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

