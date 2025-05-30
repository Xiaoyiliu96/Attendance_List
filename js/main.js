 const SUPABASE_URL = 'https://cpnbxqfduxtdufhdkuig.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwbmJ4cWZkdXh0ZHVmaGRrdWlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMjg2MjEsImV4cCI6MjA2MzYwNDYyMX0.ipVyFBRyfV_HQjDCR-_wzK-LMTuw0UE3x59gVPOtf7A';

    async function saveToSupabase(data) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/students`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText);
        }
        alert("Saved to Supabase!");
      } catch (error) {
        console.error("Database error:", error);
        alert("Failed to save to database.");
      }
    }

    document.getElementById("submitButton").addEventListener("click", () => {
      const firstName = document.getElementById("firstName").value.trim();
      const middleName = document.getElementById("middleName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const osisNumber = document.getElementById("osisNumber").value.trim();
      const gradeLevelInput = document.getElementById("gradeLevel");
      const gradeLevel = gradeLevelInput.value.trim();
      const school = Array.from(document.querySelectorAll('#schoolCheckboxes input[type="checkbox"]:checked'))
                          .map(cb => cb.value).join(', ');

      // Validation
      if (!firstName) {
        alert("Please enter your first name.");
        return;
      }
      if (!lastName) {
        alert("Please enter your last name.");
        return;
      }
      if (!osisNumber) {
        alert("Please enter your OSIS Number/Student ID.");
        return;
      }
      if (!gradeLevel || isNaN(gradeLevel) || gradeLevel < 1 || gradeLevel > 12) {
        alert("Please enter a valid grade level between 1 and 12.");
        gradeLevelInput.focus();
        return;
      }
      if (!school) {
        alert("Please select at least one school.");
        return;
      }

      const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
      document.getElementById("displayName").innerText = fullName;

      const li = document.createElement("li");
      li.textContent = `${fullName} | Grade: ${gradeLevel} | OSIS: ${osisNumber} | School: ${school}`;
      document.getElementById("submittedNamesList").appendChild(li);

      const data = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        osis_id: osisNumber,
        grade_level: Number(gradeLevel),
        school_name: school
      };

      saveToSupabase(data);
    });

    document.getElementById("saveButton").addEventListener("click", () => {
      const items = document.querySelectorAll("#submittedNamesList li");
      if (items.length === 0) return alert("No names to save.");

      let text = "";
      items.forEach(item => text += item.textContent + "\n");

      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "submitted_names.txt";
      a.click();
    });