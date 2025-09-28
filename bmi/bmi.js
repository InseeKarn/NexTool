// Unit switching
document.addEventListener('DOMContentLoaded', function() {
    const unitRadios = document.querySelectorAll('input[name="units"]');
    unitRadios.forEach(radio => {
        radio.addEventListener('change', switchUnits);
    });
});

function switchUnits() {
    const isMetric = document.querySelector('input[name="units"]:checked').value === 'metric';
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');
    
    if (isMetric) {
        metricInputs.style.display = 'block';
        imperialInputs.style.display = 'none';
    } else {
        metricInputs.style.display = 'none';
        imperialInputs.style.display = 'block';
    }
    
    // Clear result when switching units
    document.getElementById('resultCard').style.display = 'none';
}

function calculateBMI() {
    const isMetric = document.querySelector('input[name="units"]:checked').value === 'metric';
    let weight, height;
    
    if (isMetric) {
        weight = parseFloat(document.getElementById('weight').value);
        height = parseFloat(document.getElementById('height').value);
        
        if (!weight || !height) {
            alert('Please enter both weight and height');
            return;
        }
        
        if (weight <= 0 || height <= 0) {
            alert('Please enter valid positive values');
            return;
        }
        
        // Convert height from cm to meters
        height = height / 100;
    } else {
        const weightLbs = parseFloat(document.getElementById('weightLbs').value);
        const feet = parseInt(document.getElementById('feet').value);
        const inches = parseInt(document.getElementById('inches').value) || 0;
        
        if (!weightLbs || !feet) {
            alert('Please enter weight and height');
            return;
        }
        
        if (weightLbs <= 0 || feet <= 0) {
            alert('Please enter valid positive values');
            return;
        }
        
        // Convert to metric
        weight = weightLbs * 0.453592; // lbs to kg
        const totalInches = (feet * 12) + inches;
        height = totalInches * 0.0254; // inches to meters
    }
    
    // Calculate BMI
    const bmi = weight / (height * height);
    
    // Display result
    displayResult(bmi);
}

function displayResult(bmi) {
    const resultCard = document.getElementById('resultCard');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const healthInfo = document.getElementById('healthInfo');
    const bmiPointer = document.getElementById('bmiPointer');
    
    // Show result card
    resultCard.style.display = 'block';
    
    // Display BMI value
    bmiValue.textContent = bmi.toFixed(1);
    
    // Determine category and recommendations
    let category, categoryClass, recommendations, pointerPosition;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        categoryClass = 'category-underweight';
        pointerPosition = (bmi / 18.5) * 25; // 25% of chart width
        recommendations = {
            title: 'Underweight',
            description: 'Your BMI indicates you may be underweight. This could be due to various factors.',
            suggestions: [
                'Consult with a healthcare provider for personalized advice',
                'Consider a balanced diet with adequate calories',
                'Include nutrient-dense foods in your meals',
                'Regular strength training may help build muscle mass',
                'Monitor your health regularly'
            ]
        };
    } else if (bmi < 25) {
        category = 'Normal Weight';
        categoryClass = 'category-normal';
        pointerPosition = 25 + ((bmi - 18.5) / (25 - 18.5)) * 25; // 25-50% of chart width
        recommendations = {
            title: 'Normal Weight',
            description: 'Great! Your BMI is in the healthy weight range.',
            suggestions: [
                'Maintain your current healthy lifestyle',
                'Continue regular physical activity',
                'Eat a balanced, nutritious diet',
                'Stay hydrated and get adequate sleep',
                'Regular health check-ups are recommended'
            ]
        };
    } else if (bmi < 30) {
        category = 'Overweight';
        categoryClass = 'category-overweight';
        pointerPosition = 50 + ((bmi - 25) / (30 - 25)) * 25; // 50-75% of chart width
        recommendations = {
            title: 'Overweight',
            description: 'Your BMI indicates you may be overweight. Small lifestyle changes can make a big difference.',
            suggestions: [
                'Consider consulting with a healthcare provider',
                'Focus on gradual, sustainable weight loss',
                'Increase physical activity (aim for 150+ minutes/week)',
                'Choose nutrient-dense, lower-calorie foods',
                'Monitor portion sizes and eating habits'
            ]
        };
    } else {
        category = 'Obese';
        categoryClass = 'category-obese';
        pointerPosition = Math.min(75 + ((bmi - 30) / 10) * 25, 95); // 75%+ of chart width
        recommendations = {
            title: 'Obese',
            description: 'Your BMI indicates obesity. It\'s important to take steps to improve your health.',
            suggestions: [
                'Consult with a healthcare provider for a comprehensive plan',
                'Consider working with a registered dietitian',
                'Start with gradual increases in physical activity',
                'Focus on sustainable lifestyle changes',
                'Regular monitoring of health markers is important'
            ]
        };
    }
    
    // Update category display
    bmiCategory.className = `bmi-category ${categoryClass}`;
    bmiCategory.querySelector('.category-text').textContent = category;
    
    // Position pointer
    bmiPointer.style.left = `${pointerPosition}%`;
    
    // Update health information
    healthInfo.innerHTML = `
        <h3>${recommendations.title}</h3>
        <p>${recommendations.description}</p>
        <h4>Recommendations:</h4>
        <ul>
            ${recommendations.suggestions.map(suggestion => `<li>${suggestion}</li>`)}
        </ul>
    `;
}