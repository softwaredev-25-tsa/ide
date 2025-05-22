// Configure Monaco Editor to load web workers from a custom path
self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return './monaco-workers/' + label + '.worker.js';
  }
};
