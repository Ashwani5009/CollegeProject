// AI Interview Simulator JavaScript
class AIInterviewSimulator {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.currentQuestion = 1;
        this.maxQuestions = 7;
        this.isRecording = false;
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeSpeechRecognition();
        this.updateProgress();
    }

    generateSessionId() {
        return 'interview_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    initializeElements() {
        // Get DOM elements
        this.elements = {
            currentQuestionSpan: document.getElementById('current-question'),
            totalQuestionsSpan: document.getElementById('total-questions'),
            progressPercentage: document.getElementById('progress-percentage'),
            progressBar: document.getElementById('progress'),
            aiQuestion: document.getElementById('ai-question'),
            answerText: document.getElementById('answer-text'),
            recordButton: document.getElementById('record-button'),
            recordingStatus: document.getElementById('recording-status'),
            sendAnswerButton: document.getElementById('send-answer'),
            clearAnswerButton: document.getElementById('clear-answer'),
            speakQuestionButton: document.getElementById('speak-question'),
            feedbackSection: document.getElementById('feedback-section'),
            aiFeedback: document.getElementById('ai-feedback'),
            speakFeedbackButton: document.getElementById('speak-feedback'),
            completeSection: document.getElementById('complete-section'),
            finalFeedback: document.getElementById('final-feedback'),
            startNewInterviewButton: document.getElementById('start-new-interview'),
            speakFinalFeedbackButton: document.getElementById('speak-final-feedback'),
            loadingOverlay: document.getElementById('loading-overlay')
        };

        // Set total questions
        this.elements.totalQuestionsSpan.textContent = this.maxQuestions;
    }

    setupEventListeners() {
        // Answer text input
        this.elements.answerText.addEventListener('input', () => {
            this.toggleSendButton();
        });

        // Voice recording
        this.elements.recordButton.addEventListener('click', () => {
            this.toggleRecording();
        });

        // Send answer
        this.elements.sendAnswerButton.addEventListener('click', () => {
            this.sendAnswer();
        });

        // Clear answer
        this.elements.clearAnswerButton.addEventListener('click', () => {
            this.clearAnswer();
        });

        // Speak question
        this.elements.speakQuestionButton.addEventListener('click', () => {
            this.speakText(this.elements.aiQuestion.textContent);
        });

        // Speak feedback
        this.elements.speakFeedbackButton.addEventListener('click', () => {
            this.speakText(this.elements.aiFeedback.textContent);
        });

        // Start new interview
        this.elements.startNewInterviewButton.addEventListener('click', () => {
            this.startNewInterview();
        });

        // Speak final feedback
        this.elements.speakFinalFeedbackButton.addEventListener('click', () => {
            this.speakText(this.elements.finalFeedback.textContent);
        });
    }

    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = false;

            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                this.isRecording = true;
                this.updateRecordingUI();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.elements.answerText.value = transcript;
                this.toggleSendButton();
            };

            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.stopRecording();
                this.showError('Speech recognition failed. Please try again.');
            };

            this.recognition.onend = () => {
                this.stopRecording();
            };
        } else {
            console.warn('Speech recognition not supported');
            this.elements.recordButton.style.display = 'none';
        }
    }

    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

   startRecording() {
        if (!this.recognition) {
            console.warn("Speech recognition not supported or not initialized.");
            return;
        }

        if (this.isRecording) {
            console.log("Already recording...");
            return;
        }

        try {
            this.isRecording = true;
            this.updateRecordingUI();
            this.recognition.start();
        } catch (err) {
            console.error("Error starting speech recognition:", err);
            this.isRecording = false;
            this.updateRecordingUI();
            this.showError("Unable to start voice recording. Please check microphone permissions and try again.");
        }
    }


    stopRecording() {
        this.isRecording = false;
        this.updateRecordingUI();
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    updateRecordingUI() {
        if (this.isRecording) {
            this.elements.recordButton.innerHTML = '<i class="fas fa-stop"></i> Stop Recording';
            this.elements.recordButton.classList.add('recording');
            this.elements.recordingStatus.style.display = 'flex';
        } else {
            this.elements.recordButton.innerHTML = '<i class="fas fa-microphone"></i> Start Recording';
            this.elements.recordButton.classList.remove('recording');
            this.elements.recordingStatus.style.display = 'none';
        }
    }

    toggleSendButton() {
        const hasText = this.elements.answerText.value.trim().length > 0;
        this.elements.sendAnswerButton.disabled = !hasText;
    }

    clearAnswer() {
        this.elements.answerText.value = '';
        this.toggleSendButton();
    }

async sendAnswer() {
    const answer = this.elements.answerText.value.trim();
    if (!answer) return;

    this.showLoading(true);

    try {
        const response = await fetch('/api/ai-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                answer: answer,
                sessionId: this.sessionId
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        // 🧠 If interview is complete → show final feedback
        if (data.isComplete) {
            this.showInterviewComplete(data.feedback);
        } 
        else {
            // 💡 Fix: separate question and feedback cleanly
            let question = data.question;
            let feedback = data.feedback;

            // Sometimes backend sends question as a JSON string
            if (typeof question === "string" && question.trim().startsWith("{")) {
                try {
                    const parsed = JSON.parse(question);
                    question = parsed.question || question;
                    feedback = parsed.feedback || feedback;
                } catch (err) {
                    console.warn("Couldn't parse question JSON:", err);
                }
            }

            this.updateInterviewProgress(question, feedback);
        }

    } catch (error) {
        console.error('Error sending answer:', error);
        this.showError('Failed to send answer. Please try again.');
    } finally {
        this.showLoading(false);
    }
}


    updateInterviewProgress(question, feedback) {
        // Update question
        this.elements.aiQuestion.textContent = question;
        
        // Show feedback
        this.elements.aiFeedback.textContent = feedback;
        this.elements.feedbackSection.style.display = 'block';
        
        // Clear answer
        this.clearAnswer();
        // Speak the new question (voice)
        this.speakText(question);

        // Update progress *before* incrementing
        this.updateProgress();
        
        // Update progress
        if (this.currentQuestion < this.maxQuestions) {
            this.currentQuestion++;
        }
        this.updateProgress();

        
        // Speak the new question
        this.speakText(question);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showInterviewComplete(finalFeedback) {
        this.elements.finalFeedback.textContent = finalFeedback;
        this.elements.completeSection.style.display = 'block';
        this.elements.feedbackSection.style.display = 'none';
        
        // Speak final feedback
        this.speakText(finalFeedback);
        
        // Scroll to complete section
        this.elements.completeSection.scrollIntoView({ behavior: 'smooth' });
    }

    startNewInterview() {
        // Reset state
        this.sessionId = this.generateSessionId();
        this.currentQuestion = 1;
        
        // Reset UI
        this.elements.aiQuestion.textContent = "Welcome! I'm your AI interviewer. Let's start with the first question: Tell me about yourself and your technical background.";
        this.elements.feedbackSection.style.display = 'none';
        this.elements.completeSection.style.display = 'none';
        this.clearAnswer();
        this.updateProgress();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateProgress() {
        // Clamp progress so it never exceeds maxQuestions
        const progress = Math.min(this.currentQuestion, this.maxQuestions);
        
        // Calculate percentage safely
        const percentage = Math.round((progress / this.maxQuestions) * 100);

        // Update question counter (e.g., "Question 3 of 7")
        this.elements.currentQuestionSpan.textContent = progress;
        this.elements.totalQuestionsSpan.textContent = this.maxQuestions;

        // Update progress bar and percentage text
        this.elements.progressPercentage.textContent = percentage + '%';
        this.elements.progressBar.style.width = percentage + '%';
    }



    speakText(text) {
        if (this.synthesis) {
            // Cancel any ongoing speech
            this.synthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            
            // Try to use a more natural voice if available
            const voices = this.synthesis.getVoices();
            const preferredVoice = voices.find(voice => 
                voice.name.includes('Google') || 
                voice.name.includes('Microsoft') ||
                voice.name.includes('Natural')
            );
            
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            
            this.synthesis.speak(utterance);
        }
    }

    showLoading(show) {
        this.elements.loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    showError(message) {
        // Simple error display - you could enhance this with a proper modal
        alert(message);
    }
}

// Initialize the interview simulator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIInterviewSimulator();
});

// Handle page visibility change to stop speech when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});

// Handle beforeunload to clean up
window.addEventListener('beforeunload', () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
});
