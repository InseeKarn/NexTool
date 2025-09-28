let passwordHistory = [];

// Character sets
const characterSets = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    similar: '0O1lI'
};

// Update length display
document.getElementById('passwordLength').addEventListener('input', function() {
    document.getElementById('lengthValue').textContent = this.value;
});

function generatePassword() {
    const length = parseInt(document.getElementById('passwordLength').value);
    const includeUppercase = document.getElementById('includeUppercase').checked;
    const includeLowercase = document.getElementById('includeLowercase').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;
    const excludeSimilar = document.getElementById('excludeSimilar').checked;

    // Validate at least one character type is selected
    if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert('Please select at least one character type');
        return;
    }

    let charset = '';
    let guaranteedChars = '';

    // Build character set based on selections
    if (includeUppercase) {
        let upperChars = characterSets.uppercase;
        if (excludeSimilar) {
            upperChars = upperChars.replace(/[O]/g, '');
        }
        charset += upperChars;
        guaranteedChars += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    }

    if (includeLowercase) {
        let lowerChars = characterSets.lowercase;
        if (excludeSimilar) {
            lowerChars = lowerChars.replace(/[l]/g, '');
        }
        charset += lowerChars;
        guaranteedChars += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length));
    }

    if (includeNumbers) {
        let numberChars = characterSets.numbers;
        if (excludeSimilar) {
            numberChars = numberChars.replace(/[01]/g, '');
        }
        charset += numberChars;
        guaranteedChars += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    }

    if (includeSymbols) {
        charset += characterSets.symbols;
        guaranteedChars += characterSets.symbols.charAt(Math.floor(Math.random() * characterSets.symbols.length));
    }

    // Generate password
    let password = '';
    
    // Add guaranteed characters first
    for (let i = 0; i < guaranteedChars.length && i < length; i++) {
        password += guaranteedChars[i];
    }

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    // Shuffle the password to avoid predictable patterns
    password = shuffleString(password);

    // Display password
    document.getElementById('generatedPassword').value = password;
    
    // Update strength indicator
    updatePasswordStrength(password);
    
    // Add to history
    addToHistory(password);
}

function shuffleString(str) {
    return str.split('').sort(() => 0.5 - Math.random()).join('');
}

function updatePasswordStrength(password) {
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    const strengthContainer = strengthBar.parentElement.parentElement;

    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character variety check
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Remove previous strength classes
    strengthContainer.className = strengthContainer.className.replace(/strength-\w+/g, '');

    if (score < 3) {
        strengthContainer.classList.add('strength-weak');
        strengthText.textContent = 'Weak - Consider making it longer and more complex';
    } else if (score < 5) {
        strengthContainer.classList.add('strength-fair');
        strengthText.textContent = 'Fair - Good but could be stronger';
    } else if (score < 7) {
        strengthContainer.classList.add('strength-good');
        strengthText.textContent = 'Good - Strong password';
    } else {
        strengthContainer.classList.add('strength-strong');
        strengthText.textContent = 'Excellent - Very strong password';
    }
}

function copyPassword() {
    const passwordField = document.getElementById('generatedPassword');
    const copyBtn = document.getElementById('copyBtn');
    
    if (!passwordField.value) {
        alert('Please generate a password first');
        return;
    }

    passwordField.select();
    navigator.clipboard.writeText(passwordField.value).then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.background = '';
        }, 2000);
    }).catch(() => {
        // Fallback for older browsers
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.background = '';
        }, 2000);
    });
}

function addToHistory(password) {
    const timestamp = new Date().toLocaleString();
    passwordHistory.unshift({ password, timestamp, id: Date.now() });
    
    // Keep only last 10 passwords
    if (passwordHistory.length > 10) {
        passwordHistory = passwordHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('passwordHistory');
    
    if (passwordHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-passwords">No passwords generated yet.</p>';
        return;
    }

    const historyHTML = passwordHistory.map(item => `
        <div class="history-item">
            <div class="history-password">${item.password}</div>
            <div class="history-actions">
                <button onclick="copyFromHistory('${item.password}')" class="btn btn-small">Copy</button>
                <button onclick="removeFromHistory(${item.id})" class="btn btn-danger btn-small">Remove</button>
            </div>
        </div>
    `).join('');

    historyContainer.innerHTML = historyHTML;
}

function copyFromHistory(password) {
    navigator.clipboard.writeText(password).then(() => {
        // Visual feedback could be added here
    }).catch(() => {
        // Fallback
        const tempInput = document.createElement('input');
        tempInput.value = password;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
    });
}

function removeFromHistory(id) {
    passwordHistory = passwordHistory.filter(item => item.id !== id);
    updateHistoryDisplay();
}

function clearHistory() {
    if (passwordHistory.length === 0) {
        alert('No passwords to clear');
        return;
    }

    if (confirm('Are you sure you want to clear the password history?')) {
        passwordHistory = [];
        updateHistoryDisplay();
    }
}

// Generate initial password on page load
document.addEventListener('DOMContentLoaded', function() {
    generatePassword();
});