import * as vscode from 'vscode';

const STORAGE_KEY = 'codePet.activity';
const DECAY_PER_SEC = 0.2;
const EDIT_POINTS= 1;
const SAVE_POINTS = 5;

let score= 0;
let lastActivityTime =Date.now();
let needsSave = false;
let store: vscode.Mememto;

export  function startActivityTracker(context: vscode.EcxtensionContext) {
    store =context.globalState;

    const saved = store.get<{ score: number; lastActiveTime: number}> (STORAGE_KEY);
    if(saved) {
        score =saved.score;
        lastActivityTime = saved.lastActiveTime;
    }

    const saveTimer = setInterval(() => {
        if (needsSave) {
            saveActivity();
        }
    }, 5000);

    context.subscriptions.push(
        {dispose: () => clearInterval(saveTimer) },
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length ===0) return;
            const scheme = e.document.uri.scheme;
            if (scheme !== "file" && scheme != 'untitled') return;
            addPoints(EDIT_POINTS);
        }),
        vscode.workspace.onDidSaveNotebookDocument(() => addPoints(SAVE_POINTS))
    );
} 
