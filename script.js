// Handles code execution via backend API
async function runCode() {
  const code = editor.getValue();
  const lang = document.getElementById("language").value;
  const outputBox = document.getElementById("output");
  outputBox.textContent = "Running...";

  try {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language: lang, code })
    });

    const text = await response.text();
    try {
      // Attempt to parse and display result from server
      const data = JSON.parse(text);
      outputBox.textContent = data.output || data.error || "No output.";
    } catch {
      // Fallback for invalid JSON response
      outputBox.textContent = "Server returned invalid JSON:\n" + text;
    }
  } catch (err) {
    // Handles network or server-side errors
    outputBox.textContent = "Error running code: " + err.message;
  }
}

// Updates editor language and loads default code when selection changes
document.getElementById("language").addEventListener("change", (e) => {
  const lang = e.target.value;
  editor.setValue(LANGUAGE_DEFAULTS[lang] || "");
});
