const firstNameInput = document.getElementById('firstName');
const middleNameInput = document.getElementById('middleName');
const lastNameInput = document.getElementById('lastName');
const osisNumberInput = document.getElementById('osisNumber');
const gradeLevelInput = document.getElementById('gradelevel');
const schoolCheckboxes = document.querySelectorAll('#schoolCheckboxes input[type="checkbox"]');
const displayNameDiv = document.getElementById('displayName');
const submitButton = document.getElementById('submitButton');
const saveButton = document.getElementById('saveButton');
const emailButton = document.getElementById('emailButton');
const submittedNamesList = document.getElementById('submittedNamesList');

// Load submitted names from localStorage
let submittedNames = JSON.parse(localStorage.getItem('submittedNames')) || [];

// Render the submitted names list
function renderNames() {
    submittedNamesList.innerHTML = '';
    submittedNames.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}: ${entry}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeName(index);

        li.appendChild(removeButton);
        submittedNamesList.appendChild(li);
    });
}

renderNames(); // Initial render

// Update live preview
[firstNameInput, middleNameInput, lastNameInput, osisNumberInput, gradeLevelInput].forEach(input => {
    input.addEventListener('input', updateDisplayName);
});

function updateDisplayName() {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const osisNumber = osisNumberInput.value.trim();
    const gradeLevel = gradeLevelInput.value.trim();
    const selectedSchools = Array.from(schoolCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    displayNameDiv.textContent = `${firstName} ${middleName} ${lastName} OSIS: ${osisNumber} Grade Level: ${gradeLevel} ${selectedSchools.length ? ` - ${selectedSchools.join(', ')}` : ''}`;
}

// Submission logic
submitButton.addEventListener('click', () => {
    const firstName = firstNameInput.value.trim();
    const middleName = middleNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const osisNumber = osisNumberInput.value.trim();
    const gradeLevel = gradeLevelInput.value.trim();
    const selectedSchools = Array.from(schoolCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    // Required fields
    if (!firstName || !lastName || !osisNumber || !gradeLevel || selectedSchools.length === 0) {
        alert('Please fill in all required fields (first name, last name, OSIS number, grade level, and school).');
        return;
    }

    // Validate OSIS number
    if (osisNumber.length !== 9 || isNaN(osisNumber)) {
        alert('OSIS number must be a 9-digit number.');
        return;
    }

    // Validate grade level
    const grade = parseInt(gradeLevel, 10);
    if (isNaN(grade) || grade < 1 || grade > 12) {
        alert('Grade level must be a number between 1 and 12.');
        return;
    }

    // Prevent duplicate OSIS numbers
    const osisExists = submittedNames.some(entry => entry.includes(`(OSIS: ${osisNumber})`));
    if (osisExists) {
        alert('This OSIS number has already been submitted.');
        return;
    }

    // Save entry
    const fullEntry = `${firstName}, ${middleName}, ${lastName}, OSIS: ${osisNumber}, Grade Level: ${grade} - ${selectedSchools.join(', ')}`;
    submittedNames.push(fullEntry);
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames));

    // Reset form
    [firstNameInput, middleNameInput, lastNameInput, osisNumberInput, gradeLevelInput].forEach(input => input.value = '');
    schoolCheckboxes.forEach(cb => cb.checked = false);
    displayNameDiv.textContent = '';

    renderNames();
});

// Remove name by index
function removeName(index) {
    submittedNames.splice(index, 1);
    localStorage.setItem('submittedNames', JSON.stringify(submittedNames));
    renderNames();
}

// Save names to a .txt file
saveButton.addEventListener('click', () => {
    if (submittedNames.length === 0) {
        alert('No names to save.');
        return;
    }

    const blob = new Blob([submittedNames.join('\n')], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'submitted_names.txt';
    a.click();
});

// Open email client with names
emailButton.addEventListener('click', () => {
    if (submittedNames.length === 0) {
        alert('No names to email.');
        return;
    }

    const subject = encodeURIComponent('Submitted Names');
    const body = encodeURIComponent(submittedNames.join('\n'));
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
