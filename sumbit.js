// Mock data (can be replaced with real data from backend or URL parameters)
const questionData = {
    title: 'Stack Using Queue',
    id: 'stack-using-queue',
    link: 'https://example.com/stack-using-queue',
    hint: 'Try implementing two queues to simulate stack operations.',
};

window.onload = function () {
    // Set the question name
    const questionNameElement = document.getElementById('questionName');
    questionNameElement.innerText = questionData.title;

    // Set the question link
    const questionAnchor = document.getElementById('questionAnchor');
    questionAnchor.href = questionData.link;
    questionAnchor.innerText = `View the full question: ${questionData.title}`;
};

function submitCode() {
    const language = document.getElementById('language').value;
    const code = document.getElementById('code').value;

    if (code.trim() === '') {
        alert('Please enter some code before submitting.');
        return;
    }

    // Mock success message (replace with actual API call)
    document.getElementById('resultMessage').innerText =
        'Code submitted successfully! Running test cases...';
}

function showHint() {
    alert(`Hint: ${questionData.hint}`);
    
}

