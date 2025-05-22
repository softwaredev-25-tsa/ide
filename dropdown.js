// Dropdown elements for File and Edit menus
const fileDropContent = document.querySelector("#file .dropdown-content");
const fileDrop = document.querySelector("#file .dropdown-btn");
const editDropContent = document.querySelector("#edit .dropdown-content");
const editDrop = document.querySelector("#edit .dropdown-btn");

// Copy selected text from editor to clipboard
function Copy() {
    const selectedText = editor.getModel().getValueInRange(editor.getSelection());
    navigator.clipboard.writeText(selectedText).catch(() => console.error("Nothing copied"));
}

// Paste text from clipboard into editor at cursor
function Paste() {
    navigator.clipboard.readText().then(text => {
        editor.executeEdits(null, [{ range: editor.getSelection(), text, forceMoveMarkers: true }]);
    }).catch(() => console.error("Nothing to paste"));
}

// Toggle visibility of dropdown menu
function toggleDropdown(content, button) {
    let ddContent = document.querySelector(content);
    let ddBtn = document.querySelector(button);
    ddContent.classList.toggle("show");
    ddBtn.classList.toggle("show");
}

// Close dropdowns if clicking outside of them
document.addEventListener("click", event => {
    if (!fileDrop.contains(event.target) && !fileDropContent.contains(event.target)) {
        fileDropContent.classList.remove("show");
        fileDrop.classList.remove("show");
    }
    if (!editDrop.contains(event.target) && !editDropContent.contains(event.target)) {
        editDropContent.classList.remove("show");
        editDrop.classList.remove("show");
    }
});

// Close File dropdown after clicking any menu item
document.querySelectorAll("#file .dropdown-content ul").forEach(item => {
    item.addEventListener("click", () => {
        fileDropContent.classList.remove("show");
        fileDrop.classList.remove("show");
    });
});

// Close Edit dropdown after clicking any menu item
document.querySelectorAll("#edit .dropdown-content ul").forEach(item => {
    item.addEventListener("click", () => {
        editDropContent.classList.remove("show");
        editDrop.classList.remove("show");
    });
});

// Keyboard shortcuts for common actions
document.addEventListener("keydown", event => {
    if (event.ctrlKey) {
        switch (event.code) {
            case "KeyO":
                event.preventDefault();
                openFile();
                break;
            case "KeyK":
                event.preventDefault();
                openFolder();
                break;
            case "KeyF":
                event.preventDefault();
                editor.getAction('actions.find').run();
                break;
            case "KeyH":
                event.preventDefault();
                editor.getAction('editor.action.startFindReplaceAction').run();
                break;
        }
    }
});
