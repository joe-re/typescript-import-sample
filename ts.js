const ts = require('typescript');
const fs = require('fs');

const files = {};
const rootFileNames=['./a.ts', './b.ts'];
const options = { module: ts.ModuleKind.CommonJS };

// initialize the list of files
rootFileNames.forEach(fileName => {
    files[fileName] = { version: 0 };
});
const servicesHost = {
  getScriptFileNames: () => rootFileNames,
  getScriptVersion: (fileName) => files[fileName] && files[fileName].version.toString(),
  getScriptSnapshot: (fileName) => {
    if (!fs.existsSync(fileName)) { return undefined; }
    return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
  },
  getCurrentDirectory: () => process.cwd(),
  getCompilationSettings: () => options,
  getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
};


const services = ts.createLanguageService(servicesHost, ts.createDocumentRegistry())
// a.ts is resolved to relative path.
console.log(services.getEmitOutput('./a.ts').outputFiles.map((f) => f.name));

// b.ts is resolved to absolute path.
console.log(services.getEmitOutput('./b.ts').outputFiles.map((f) => f.name));
