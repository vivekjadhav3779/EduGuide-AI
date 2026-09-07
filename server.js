const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Serve website files
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


// ========================================
// HOME PAGE
// ========================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});


// ========================================
// AI COUNSELLING
// ========================================

app.post("/api/counsel", async (req, res) => {

    try {

        const { message, language } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: "Message is required"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-3.6-flash"
        });

        const prompt = `
You are EduGuide AI, an AI College Admission Counsellor.

Help students with:

- Course selection
- College selection
- Eligibility
- Admission process
- Required documents
- Entrance exams
- Career guidance
- Application guidance

Give simple, clear and practical answers.

If the student asks in Marathi, answer in Marathi.

If the student asks in Hindi, answer in Hindi.

Otherwise answer in English.

Do not invent admission rules or deadlines.

For changing information, tell the student to verify the official college website.

Student language:
${language || "English"}

Student Question:
${message}
`;

        const result = await model.generateContent(prompt);

        const response = await result.response;

        const reply = response.text();

        res.json({
            success: true,
            reply: reply
        });

    } catch (error) {

        console.error("AI ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message
        });

    }

});


// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

    console.log("");
    console.log("====================================");
    console.log("EDUGUIDE AI SERVER STARTED");
    console.log("====================================");
    console.log(`Server running on port ${PORT}`);
    console.log("====================================");

});
