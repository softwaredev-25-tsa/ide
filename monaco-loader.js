let editor;

// Load Monaco Editor from CDN
require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs" } });

require(["vs/editor/editor.main"], () => {
  const lang = document.getElementById("language").value;

  // Initialize editor with default language and content
  editor = monaco.editor.create(document.getElementById("editor"), {
    value: LANGUAGE_DEFAULTS[lang],
    language: lang,
    theme: "vs-dark",
    automaticLayout: true // Adjust layout automatically on resize
  });

  // Update editor language and default content when selection changes
  document.getElementById("language").addEventListener("change", (e) => {
    const newLang = e.target.value;
    monaco.editor.setModelLanguage(editor.getModel(), newLang);
    editor.setValue(LANGUAGE_DEFAULTS[newLang]);
  });
});
