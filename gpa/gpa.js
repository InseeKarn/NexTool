let courses = [];

function addCourse() {
    const courseName = document.getElementById('courseName').value.trim();
    const courseGrade = document.getElementById('courseGrade').value;
    const courseCredits = document.getElementById('courseCredits').value;

    if (!courseName || !courseGrade || !courseCredits) {
        alert('Please fill in all fields');
        return;
    }

    if (courseCredits < 1 || courseCredits > 6) {
        alert('Credits must be between 1 and 6');
        return;
    }

    const course = {
        id: Date.now(),
        name: courseName,
        grade: parseFloat(courseGrade),
        credits: parseInt(courseCredits)
    };

    courses.push(course);
    updateCoursesDisplay();
    calculateGPA();
    clearInputs();
}

function removeCourse(courseId) {
    courses = courses.filter(course => course.id !== courseId);
    updateCoursesDisplay();
    calculateGPA();
}

function updateCoursesDisplay() {
    const coursesListElement = document.getElementById('coursesList');
    
    if (courses.length === 0) {
        coursesListElement.innerHTML = '<p class="no-courses">No courses added yet. Add a course above to get started.</p>';
        return;
    }

    const coursesHTML = courses.map(course => `
        <div class="course-item">
            <div class="course-info">
                <div class="course-name">${course.name}</div>
                <div class="course-details">
                    Grade: ${getGradeLetter(course.grade)} (${course.grade}) • Credits: ${course.credits}
                </div>
            </div>
            <div class="course-actions">
                <button onclick="removeCourse(${course.id})" class="btn btn-danger btn-small">Remove</button>
            </div>
        </div>
    `).join('');

    coursesListElement.innerHTML = coursesHTML;
}

function getGradeLetter(gradePoint) {
    if (gradePoint >= 4.0) return 'A';
    if (gradePoint >= 3.7) return 'A-';
    if (gradePoint >= 3.3) return 'B+';
    if (gradePoint >= 3.0) return 'B';
    if (gradePoint >= 2.7) return 'B-';
    if (gradePoint >= 2.3) return 'C+';
    if (gradePoint >= 2.0) return 'C';
    if (gradePoint >= 1.7) return 'C-';
    if (gradePoint >= 1.3) return 'D+';
    if (gradePoint >= 1.0) return 'D';
    return 'F';
}

function calculateGPA() {
    if (courses.length === 0) {
        document.getElementById('gpaResult').textContent = '0.00';
        document.getElementById('totalCredits').textContent = '0';
        document.getElementById('totalPoints').textContent = '0.00';
        return;
    }

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalQualityPoints = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    const gpa = totalQualityPoints / totalCredits;

    document.getElementById('gpaResult').textContent = gpa.toFixed(2);
    document.getElementById('totalCredits').textContent = totalCredits.toString();
    document.getElementById('totalPoints').textContent = totalQualityPoints.toFixed(2);
}

function clearInputs() {
    document.getElementById('courseName').value = '';
    document.getElementById('courseGrade').value = '';
    document.getElementById('courseCredits').value = '';
}

function clearAll() {
    if (courses.length === 0) {
        alert('No courses to clear');
        return;
    }

    if (confirm('Are you sure you want to clear all courses? This action cannot be undone.')) {
        courses = [];
        updateCoursesDisplay();
        calculateGPA();
    }
}

// Add course on Enter key press
document.addEventListener('DOMContentLoaded', function() {
    const inputs = ['courseName', 'courseGrade', 'courseCredits'];
    inputs.forEach(inputId => {
        document.getElementById(inputId).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addCourse();
            }
        });
    });
});