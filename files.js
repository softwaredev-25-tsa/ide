const openedFiles = [];          // Tracks names of files currently opened in the editor
const fileHandles = {};          // Maps file names to their path and metadata

// Opens a single file using Electron API
async function openFile() {
  const result = await window.electronAPI.openFile();
  if (!result) {
    showNotification("File open cancelled.", "info", "#CCCCCC");
    return;
  }

  const { path, content } = result;
  const name = path.split(/[/\\]/).pop(); // Extract filename from path

  // Add file to openedFiles and track its path if not already opened
  if (!openedFiles.includes(name)) {
    openedFiles.push(name);
    fileHandles[name] = { path, name };
    updateSidebar();
  }

  editor.setValue(content);   // Load file content into editor
  setActiveFile(name);        // Highlight this file in sidebar
  hideWelcome();              // Hide welcome screen once a file is opened
  showNotification(`Opened ${name} successfully.`, "check-circle", "#5FC234");
}

// Opens a folder and loads its files (multiple)
async function openFolder() {
  const results = await window.electronAPI.openFolder();
  if (!results) {
    showNotification("Folder open cancelled.", "info", "#CCCCCC");
    return;
  }

  // Clear current opened files and handles
  openedFiles.length = 0;
  for (const key in fileHandles) delete fileHandles[key];

  // Add all files from the folder to openedFiles and fileHandles
  for (const { path, name, content } of results) {
    openedFiles.push(name);
    fileHandles[name] = { path, name };
  }

  updateSidebar();

  // Open first file in folder automatically
  const first = results[0];
  if (first) {
    editor.setValue(first.content);
    setActiveFile(first.name);
  }

  hideWelcome();
  showNotification("Opened folder successfully.", "check-circle", "#5FC234");
}

// Refreshes the sidebar file list UI based on openedFiles array
function updateSidebar() {
  const openedFilesList = document.getElementById("opened-files");
  openedFilesList.innerHTML = "";

  openedFiles.forEach((fileName) => {
    const file = document.createElement("li");
    file.textContent = fileName;
    file.classList.add("file-item");

    // Clicking a file in sidebar opens it
    file.addEventListener("click", () => {
      openFileSidebar(fileName);
    });

    openedFilesList.appendChild(file);
  });

  setActiveFile(getActiveFileName()); // Highlight currently active file
}

// Highlights the active file in the sidebar
function setActiveFile(fileName) {
  document.querySelectorAll(".file-item").forEach((item) => {
    if (item.textContent === fileName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Returns the file name currently active in the editor/sidebar
function getActiveFileName() {
  const active = document.querySelector(".file-item.active");
  return active ? active.textContent : null;
}

// Opens a file from sidebar by reading fresh content and loading into editor
async function openFileSidebar(fileName) {
  const handle = fileHandles[fileName];
  if (!handle) return;

  try {
    const content = await window.electronAPI.readFile(handle.path);
    editor.setValue(content);
    setActiveFile(fileName);
  } catch (e) {
    console.error(`Error opening ${fileName}:`, e);
    showNotification(`Failed to open ${fileName}.`, "error", "#F48872");
  }
}

// Saves the current active file's content to disk
async function saveFile() {
  const fileName = getActiveFileName();
  const handle = fileHandles[fileName];
  if (!handle || !handle.path) {
    showNotification("No file open to save.", "error", "#F48872");
    return;
  }

  try {
    const succ = await window.electronAPI.saveFile(handle.path, editor.getValue());
    if (succ) {
      showNotification(`Saved ${fileName} successfully.`, "check-circle", "#5FC234");
    } else {
      showNotification("Failed to save file.", "error", "#F48872");
    }
  } catch (e) {
    console.error("Error saving via IPC:", e);
    showNotification("Failed to save file.", "error", "#F48872");
  }
}

// Sends the current file’s code to the server, handles response, and loads output file if generated
async function sendFile() {
  const fileName = getActiveFileName();
  const outputName = fileName.replace(/\.py$/, ".json");  // Assumes Python file output as JSON

  const handle = fileHandles[fileName];
  if (!handle || !handle.path) {
    showNotification("No file open to send.", "error", "#F48872");
    return;
  }

  const code = editor.getValue();
  showNotification("Sending File...", "info", "#CCCCCC");

  const res = await window.electronAPI.sendFile(code, handle.path);

  if (res) {
    showNotification("Output received!", "check-circle", "#5FC234");

    // Load generated output JSON file into editor and sidebar
    const jsonPath = handle.path.replace(/\.py$/, '.json');
    const jsonContent = await window.electronAPI.readFile(jsonPath);

    if (!openedFiles.includes(outputName)) {
      openedFiles.push(outputName);
      fileHandles[outputName] = { path: jsonPath, name: outputName };
      updateSidebar();
    }
    editor.setValue(jsonContent);
    setActiveFile(outputName);
  } else {
    showNotification("Error sending to server.", "error", "#F48872");
  }
}
