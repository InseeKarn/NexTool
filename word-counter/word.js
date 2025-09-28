let currentText = '';

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const fileInput = document.getElementById('fileInput');
    
    textInput.addEventListener('input', updateStats);
    fileInput.addEventListener('change', handleFileUpload);
});

function updateStats() {
    const text = document.getElementById('textInput').value;
    currentText = text;
    
    // Basic counts
    const wordCount = countWords(text);
    const charCount = text.length;
    const charNoSpaceCount = text.replace(/\s/g, '').length;
    const paragraphCount = countParagraphs(text);
    const sentenceCount = countSentences(text);
    const readingTime = calculateReadingTime(wordCount);
    
    // Update display
    document.getElementById('wordCount').textContent = wordCount;
    document.getElementById('charCount').textContent = charCount;
    document.getElementById('charNoSpaceCount').textContent = charNoSpaceCount;
    document.getElementById('paragraphCount').textContent = paragraphCount;
    document.getElementById('sentenceCount').textContent = sentenceCount;
    document.getElementById('readingTime').textContent = readingTime;
    
    // Advanced analysis
    updateAdvancedAnalysis(text, wordCount, sentenceCount);
    
    // Update word frequency (show top 10 by default)
    if (text.trim()) {
        showTopWords(10);
    } else {
        document.getElementById('wordFrequency').innerHTML = '<p class="no-data">Enter text to see word frequency analysis</p>';
    }
}

function countWords(text) {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

function countParagraphs(text) {
    if (!text.trim()) return 0;
    return text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
}

function countSentences(text) {
    if (!text.trim()) return 0;
    return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
}

function calculateReadingTime(wordCount) {
    // Average reading speed: 200 words per minute
    return Math.ceil(wordCount / 200);
}

function updateAdvancedAnalysis(text, wordCount, sentenceCount) {
    const words = getWords(text);
    
    // Average words per sentence
    const avgWordsPerSentence = sentenceCount > 0 ? (wordCount / sentenceCount).toFixed(1) : 0;
    
    // Average characters per word
    const totalChars = words.join('').length;
    const avgCharsPerWord = wordCount > 0 ? (totalChars / wordCount).toFixed(1) : 0;
    
    // Longest word
    const longestWord = words.length > 0 ? words.reduce((a, b) => a.length > b.length ? a : b) : '-';
    
    // Most frequent word
    const mostFrequentWord = getMostFrequentWord(words);
    
    document.getElementById('avgWordsPerSentence').textContent = avgWordsPerSentence;
    document.getElementById('avgCharsPerWord').textContent = avgCharsPerWord;
    document.getElementById('longestWord').textContent = longestWord;
    document.getElementById('mostFrequentWord').textContent = mostFrequentWord;
}

function getWords(text) {
    if (!text.trim()) return [];
    return text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
}

function getMostFrequentWord(words) {
    if (words.length === 0) return '-';
    
    const frequency = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.keys(frequency).reduce((a, b) => frequency[a] > frequency[b] ? a : b);
}

function getWordFrequency(words) {
    const frequency = {};
    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .map(([word, count]) => ({ word, count }));
}

function showTopWords(count) {
    const words = getWords(currentText);
    if (words.length === 0) {
        document.getElementById('wordFrequency').innerHTML = '<p class="no-data">Enter text to see word frequency analysis</p>';
        return;
    }
    
    const frequency = getWordFrequency(words);
    const topWords = frequency.slice(0, count);
    
    const html = topWords.map(item => `
        <div class="frequency-item">
            <span class="frequency-word">${item.word}</span>
            <span class="frequency-count">${item.count}</span>
        </div>
    `).join('');
    
    document.getElementById('wordFrequency').innerHTML = html;
}

function clearText() {
    document.getElementById('textInput').value = '';
    currentText = '';
    updateStats();
}

function copyText() {
    const textInput = document.getElementById('textInput');
    if (!textInput.value.trim()) {
        alert('No text to copy');
        return;
    }
    
    textInput.select();
    navigator.clipboard.writeText(textInput.value).then(() => {
        alert('Text copied to clipboard!');
    }).catch(() => {
        // Fallback
        document.execCommand('copy');
        alert('Text copied to clipboard!');
    });
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'text/plain') {
        alert('Please upload a .txt file');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('textInput').value = e.target.result;
        updateStats();
    };
    reader.readAsText(file);
}

function transformText(type) {
    const textInput = document.getElementById('textInput');
    let text = textInput.value;
    
    if (!text.trim()) {
        alert('No text to transform');
        return;
    }
    
    switch (type) {
        case 'uppercase':
            text = text.toUpperCase();
            break;
        case 'lowercase':
            text = text.toLowerCase();
            break;
        case 'capitalize':
            text = text.replace(/\b\w/g, l => l.toUpperCase());
            break;
        case 'sentence':
            text = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
            break;
    }
    
    textInput.value = text;
    updateStats();
}

function removeExtraSpaces() {
    const textInput = document.getElementById('textInput');
    let text = textInput.value;
    
    if (!text.trim()) {
        alert('No text to process');
        return;
    }
    
    // Replace multiple spaces with single space
    text = text.replace(/\s+/g, ' ').trim();
    
    textInput.value = text;
    updateStats();
}

function removeLineBreaks() {
    const textInput = document.getElementById('textInput');
    let text = textInput.value;
    
    if (!text.trim()) {
        alert('No text to process');
        return;
    }
    
    // Replace line breaks with spaces
    text = text.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
    
    textInput.value = text;
    updateStats();
}