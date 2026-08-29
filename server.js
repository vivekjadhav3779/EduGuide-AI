const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


// ========================================
// TEST ROUTE
// ========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "AI College Counsellor Backend is running!"
    });

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


        const response = await client.responses.create({

            model: "gpt-5.6-luna",

            instructions: `
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
`,

            input: message

        });


        res.json({

            success: true,

            reply: response.output_text

        });

    }


    catch (error) {

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

const PORT = 3000;

app.listen(PORT, "127.0.0.1", () => {

    console.log("");
    console.log("====================================");
    console.log("EDUGUIDE AI SERVER STARTED");
    console.log("====================================");
    console.log(`http://localhost:${PORT}`);
    console.log("====================================");

});