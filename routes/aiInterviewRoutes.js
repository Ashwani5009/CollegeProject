const express = require("express");
const router = express.Router();
const { Groq } = require("groq-sdk");

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const interviewSessions = new Map();

// ---------- Main AI Interview Route ----------
router.post("/", async (req, res) => {
  try {
    const { answer, sessionId } = req.body;
    if (!answer) return res.status(400).json({ error: "Answer is required" });

    let session = interviewSessions.get(sessionId);
    if (!session) {
      session = { questions: [], answers: [], currentQuestion: 0, maxQuestions: 6 };
      interviewSessions.set(sessionId, session);
    }

    session.answers.push(answer);

    if (session.currentQuestion >= session.maxQuestions) {
      const finalFeedback = await generateFinalFeedback(session.questions, session.answers);
      return res.json({ isComplete: true, feedback: finalFeedback, question: null });
    }

    const response = await generateInterviewResponse(session.questions, session.answers, session.currentQuestion);
    session.questions.push(response.question);
    session.currentQuestion++;

    res.json({ isComplete: false, question: response.question, feedback: response.feedback });
  } catch (err) {
    console.error("AI Interview Error:", err);
    res.status(500).json({ error: "Failed to process interview response" });
  }
});

// ---------- Helper: Generate Question + Feedback ----------
async function generateInterviewResponse(questions, answers, questionIndex) {
const systemPrompt = `
You are an experienced senior software developer conducting a mock technical interview for a candidate.
Act like a real human interviewer — be conversational, analytical, and supportive.

🧩 Interview Guidelines:
- Begin with **easy** questions about general programming and background.
- Gradually move to **medium** and then **hard-level** questions about coding logic, problem-solving, and system understanding.
- Ask **one question at a time** — do not list multiple questions together.
- Keep the tone **friendly but professional**, like a real interviewer.
- Avoid repeating previous questions or generic statements.

💬 Feedback Rules:
- After each answer, provide thoughtful, *human-like feedback*.
- Acknowledge what was good in the candidate’s answer.
- Point out areas that can be improved.
- Keep feedback concise (2–3 sentences max), constructive, and realistic.

🎯 Response Format (MUST be valid JSON):
{
  "question": "Next interview question here...",
  "feedback": "Short human-like feedback on the last answer."
}
`;


  const conversationHistory = questions
    .map((q, i) => `Question ${i + 1}: ${q}\nAnswer: ${answers[i] || "No answer"}`)
    .join("\n\n");

  const fullPrompt = `${systemPrompt}

  You are now asking Question ${questionIndex + 1} out of 6.
  Conversation so far:
  ${conversationHistory}

  Generate the next question and feedback based on the candidate's last answer.
  Ensure question difficulty increases gradually.`;


  try {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: fullPrompt },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  let text = completion.choices[0].message.content.trim();

  // --- Clean and normalize response ---
  if (text.startsWith("```json")) text = text.replace(/```json|```/g, "").trim();
  if (text.startsWith("```")) text = text.replace(/```/g, "").trim();

  let question = "";
  let feedback = "";

  try {
    // Try to parse JSON directly
    const parsed = JSON.parse(text);
    question = parsed.question || "";
    feedback = parsed.feedback || "";
  } catch {
    // If it's not JSON, extract from plain text
    const matchQ = text.match(/"question"\s*:\s*"([^"]+)"/i);
    const matchF = text.match(/"feedback"\s*:\s*"([^"]+)"/i);
    if (matchQ) question = matchQ[1];
    if (matchF) feedback = matchF[1];

    if (!question) question = text.split("\n")[0];
    if (!feedback) feedback = text.split("\n").slice(1).join(" ");
  }

  return {
    question: question.trim() || "Tell me about a challenging project you worked on.",
    feedback: feedback.trim() || "Thanks for your answer, let's continue.",
  };
} catch (err) {
  console.error("Groq API Error:", err);
  const fallback = [
    "Tell me about yourself and your technical background.",
    "Describe a challenging project you worked on recently.",
    "How do you approach debugging a complex issue?",
    "What programming languages are you most comfortable with?",
    "Tell me about a time you had to learn a new technology quickly.",
    "How do you stay updated with the latest technology trends?",
  ];
  return { question: fallback[questionIndex], feedback: "Thanks, let's continue." };
}
}

// ---------- Helper: Final Feedback ----------
async function generateFinalFeedback(questions, answers) {
  const systemPrompt = `
  You are an expert technical interviewer responsible for generating the FINAL INTERVIEW FEEDBACK.

Your feedback MUST follow this exact format:

1️⃣ *INTERVIEW PERFORMANCE RATINGS (at the top)*  
Give numerical ratings out of 5 for each category based on the candidate's answers:
- Technical Knowledge: x/5
- Communication Clarity: x/5
- Problem-Solving Ability: x/5
- Confidence & Delivery: x/5
- Overall Interview Score: x/5

2️⃣ *DETAILED FEEDBACK SUMMARY*  
After the ratings, provide a structured written summary including:
- Strengths shown by the candidate  
- Areas for improvement  
- Evaluation of communication style  
- Evaluation of technical depth  
- Overall readiness for real interviews  

3️⃣ *STYLE REQUIREMENTS*
- Be highly specific and personalized to the candidate's actual answers.
- Do NOT be generic.
- Be professional, supportive, and constructive.
- No JSON. Return plain text with headings and bullet points.
- Ratings must ALWAYS appear at the top.
  
You will receive all questions and answers from the mock interview. Based on that conversation, produce the final review following the structure above
  `;
  const conversationSummary = questions
    .map((q, i) => `Q${i + 1}: ${q}\nA: ${answers[i] || "No answer"}`)
    .join("\n\n");

  const fullPrompt = `${systemPrompt}\n\nInterview Summary:\n${conversationSummary}\n\nProvide final feedback:`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: fullPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("Groq Final Feedback Error:", err);
    return "Thank you for completing the interview! You demonstrated strong communication and good technical knowledge.";
  }
}


module.exports = router;
