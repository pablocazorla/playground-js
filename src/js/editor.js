import * as monaco from "monaco-editor";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { SNIPPETS, CURRENT_SNIPPET } from "./store";
import { NAME_STORAGE, DEFAULT_DATA } from "./constants";

class Editor {
  constructor() {
    window.MonacoEnvironment = {
      getWorker(_, label) {
        if (label === "typescript" || label === "javascript")
          return new TsWorker();
      },
    };
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    this.container = document.getElementById("container");
    this.console = document.getElementById("console");

    this.codeEditor = monaco.editor.create(container, {
      value: "",
      language: "javascript",
      theme: "vs-dark",
      fontSize: 18,
      minimap: {
        enabled: false,
      },
    });

    let timer = null;
    this.codeEditor.onDidChangeModelContent(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.updateConsole();
        this.saveInLocalhost();
      }, 1400);
    });

    this.updateConsole();

    CURRENT_SNIPPET.subscribe((snippetId) => {
      const content = SNIPPETS.get().snippets[snippetId].content;
      this.updateValue(content);
    });

    this.recoverData();
  }
  recoverData() {
    const dataSaved =
      window.localStorage.getItem(NAME_STORAGE) ?? JSON.stringify(DEFAULT_DATA);

    const newSnippets = JSON.parse(dataSaved);
    SNIPPETS.set(newSnippets);
    const content = newSnippets.snippets[0].content;
    this.updateValue(content);
    CURRENT_SNIPPET.set(0);
  }
  updateValue(content) {
    this.codeEditor.setValue(content);
    this.updateConsole();
  }
  updateConsole() {
    const resp = this.codeEditor.getValue();
    try {
      const text = eval(resp);
      this.console.innerHTML = typeof text === "undefined" ? "" : text;
    } catch (e) {
      this.console.innerHTML = `<div class="err">${e}</div>`;
    }
  }
  saveInLocalhost() {
    let prevData = SNIPPETS.get();
    const currentSnippetIndex = CURRENT_SNIPPET.get();

    prevData.snippets[currentSnippetIndex].content = this.codeEditor.getValue();

    localStorage.setItem(NAME_STORAGE, JSON.stringify(prevData));
  }
}

export default Editor;
