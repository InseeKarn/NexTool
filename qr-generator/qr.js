let qrHistory = [];
let currentQRCode = null;

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    const contentTypeRadios = document.querySelectorAll('input[name="contentType"]');
    contentTypeRadios.forEach(radio => {
        radio.addEventListener('change', switchContentType);
    });
    
    // Add enter key support for inputs
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                generateQR();
            }
        });
    });
});

function switchContentType() {
    const selectedType = document.querySelector('input[name="contentType"]:checked').value;
    
    // Hide all input groups
    const inputGroups = document.querySelectorAll('.input-group');
    inputGroups.forEach(group => group.style.display = 'none');
    
    // Show selected input group
    document.getElementById(selectedType + 'Input').style.display = 'block';
}

function generateQR() {
    const contentType = document.querySelector('input[name="contentType"]:checked').value;
    const content = getContentByType(contentType);
    
    if (!content.trim()) {
        alert('Please enter content for the QR code');
        return;
    }
    
    const size = parseInt(document.getElementById('qrSize').value);
    const qrColor = document.getElementById('qrColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const errorLevel = document.getElementById('errorLevel').value;
    
    const qrDisplay = document.getElementById('qrDisplay');
    const qrActions = document.getElementById('qrActions');
    
    // Clear previous QR code
    qrDisplay.innerHTML = '';
    
    // Create canvas
    const canvas = document.createElement('canvas');
    qrDisplay.appendChild(canvas);
    
    // Generate QR code
    QRCode.toCanvas(canvas, content, {
        width: size,
        height: size,
        color: {
            dark: qrColor,
            light: bgColor
        },
        errorCorrectionLevel: errorLevel,
        margin: 2
    }, function(error) {
        if (error) {
            console.error(error);
            alert('Error generating QR code. Please check your input.');
            return;
        }
        
        currentQRCode = {
            canvas: canvas,
            content: content,
            contentType: contentType,
            size: size,
            qrColor: qrColor,
            bgColor: bgColor,
            errorLevel: errorLevel,
            timestamp: new Date().toLocaleString()
        };
        
        // Show action buttons
        qrActions.style.display = 'flex';
        
        // Add to history
        addToHistory(currentQRCode);
    });
}

function getContentByType(type) {
    switch (type) {
        case 'text':
            return document.getElementById('textContent').value;
            
        case 'url':
            let url = document.getElementById('urlContent').value;
            if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            return url;
            
        case 'email':
            const email = document.getElementById('emailAddress').value;
            const subject = document.getElementById('emailSubject').value;
            const body = document.getElementById('emailBody').value;
            
            let mailto = `mailto:${email}`;
            const params = [];
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            if (params.length > 0) mailto += '?' + params.join('&');
            
            return mailto;
            
        case 'phone':
            const phone = document.getElementById('phoneNumber').value;
            return `tel:${phone}`;
            
        case 'wifi':
            const ssid = document.getElementById('wifiSSID').value;
            const password = document.getElementById('wifiPassword').value;
            const security = document.getElementById('wifiSecurity').value;
            const hidden = document.getElementById('wifiHidden').checked;
            
            let wifiString = `WIFI:T:${security};S:${ssid};P:${password}`;
            if (hidden) wifiString += ';H:true';
            wifiString += ';;';
            
            return wifiString;
            
        default:
            return '';
    }
}

function downloadQR() {
    if (!currentQRCode) {
        alert('No QR code to download');
        return;
    }
    
    const canvas = currentQRCode.canvas;
    const link = document.createElement('a');
    link.download = `qr-code-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

function printQR() {
    if (!currentQRCode) {
        alert('No QR code to print');
        return;
    }
    
    const canvas = currentQRCode.canvas;
    const printWindow = window.open('', '_blank');
    const img = new Image();
    img.src = canvas.toDataURL();
    
    img.onload = function() {
        printWindow.document.write(`
            <html>
                <head>
                    <title>QR Code</title>
                    <style>
                        body { 
                            display: flex; 
                            justify-content: center; 
                            align-items: center; 
                            min-height: 100vh; 
                            margin: 0;
                            font-family: Arial, sans-serif;
                        }
                        .print-container {
                            text-align: center;
                        }
                        img { 
                            max-width: 400px; 
                            max-height: 400px; 
                        }
                        .qr-info {
                            margin-top: 20px;
                            font-size: 14px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        <img src="${img.src}" alt="QR Code">
                        <div class="qr-info">
                            <p>Content: ${currentQRCode.content}</p>
                            <p>Generated: ${currentQRCode.timestamp}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
    };
}

async function shareQR() {
    if (!currentQRCode) {
        alert('No QR code to share');
        return;
    }
    
    const canvas = currentQRCode.canvas;
    
    if (navigator.share && navigator.canShare) {
        try {
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'qr-code.png', { type: 'image/png' });
                
                if (navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'QR Code',
                        text: 'Check out this QR code!',
                        files: [file]
                    });
                } else {
                    // Fallback: copy to clipboard
                    copyQRToClipboard();
                }
            });
        } catch (error) {
            console.log('Error sharing:', error);
            copyQRToClipboard();
        }
    } else {
        copyQRToClipboard();
    }
}

function copyQRToClipboard() {
    if (!currentQRCode) return;
    
    const canvas = currentQRCode.canvas;
    canvas.toBlob(async (blob) => {
        try {
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            alert('QR code copied to clipboard!');
        } catch (error) {
            // Fallback: download instead
            downloadQR();
        }
    });
}

function addToHistory(qrCode) {
    // Create a small preview canvas
    const previewCanvas = document.createElement('canvas');
    const previewSize = 60;
    previewCanvas.width = previewSize;
    previewCanvas.height = previewSize;
    
    const ctx = previewCanvas.getContext('2d');
    ctx.drawImage(qrCode.canvas, 0, 0, previewSize, previewSize);
    
    const historyItem = {
        id: Date.now(),
        content: qrCode.content,
        contentType: qrCode.contentType,
        timestamp: qrCode.timestamp,
        previewCanvas: previewCanvas,
        fullCanvas: qrCode.canvas.cloneNode(true)
    };
    
    qrHistory.unshift(historyItem);
    
    // Keep only last 10 QR codes
    if (qrHistory.length > 10) {
        qrHistory = qrHistory.slice(0, 10);
    }
    
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('qrHistory');
    
    if (qrHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-history">No QR codes generated yet.</p>';
        return;
    }
    
    const historyHTML = qrHistory.map(item => {
        const preview = item.previewCanvas.toDataURL();
        const shortContent = item.content.length > 50 ? item.content.substring(0, 50) + '...' : item.content;
        
        return `
            <div class="history-item">
                <div class="history-preview">
                    <img src="${preview}" alt="QR Preview">
                </div>
                <div class="history-info">
                    <div class="history-content">${shortContent}</div>
                    <div class="history-details">Type: ${item.contentType} | ${item.timestamp}</div>
                </div>
                <div class="history-actions">
                    <button onclick="downloadFromHistory(${item.id})" class="btn btn-small">Download</button>
                    <button onclick="removeFromHistory(${item.id})" class="btn btn-danger btn-small">Remove</button>
                </div>
            </div>
        `;
    }).join('');
    
    historyContainer.innerHTML = historyHTML;
}

function downloadFromHistory(id) {
    const item = qrHistory.find(item => item.id === id);
    if (!item) return;
    
    const link = document.createElement('a');
    link.download = `qr-code-${id}.png`;
    link.href = item.fullCanvas.toDataURL();
    link.click();
}

function removeFromHistory(id) {
    qrHistory = qrHistory.filter(item => item.id !== id);
    updateHistoryDisplay();
}

function clearHistory() {
    if (qrHistory.length === 0) {
        alert('No history to clear');
        return;
    }
    
    if (confirm('Are you sure you want to clear the QR code history?')) {
        qrHistory = [];
        updateHistoryDisplay();
    }
}