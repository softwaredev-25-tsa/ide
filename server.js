const express = require("express");
const bodyParser = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests and serve static files
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// API endpoint to run submitted code
app.post("/api/run", (req, res) => {
  const { language, code } = req.body;

  // File extensions and commands per supported language
  const extMap = { javascript: "temp.js", python: "temp.py" };
  const execMap = { javascript: "node", python: "python3" };

  const filename = extMap[language];
  const command = `${execMap[language]} ${filename}`;

  if (!filename || !command) {
    return res.status(400).json({ error: "Unsupported language" });
  }

  // Save the submitted code to a temp file
  fs.writeFile(filename, code, (err) => {
    if (err) return res.status(500).json({ error: "Failed to write file" });

    // Execute the code with a timeout
    exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
      fs.unlink(filename, () => {}); // Clean up temp file

      if (error) return res.json({ error: stderr || error.message });
      res.json({ output: stdout });
    });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
