"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetViewProvider = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
class PetViewProvider {
    extensionUri;
    view;
    constructor(extensionUri) {
        this.extensionUri = extensionUri;
    }
    resolveWebviewView(webviewView) {
        this.view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'media')]
        };
        webviewView.webview.html = this.getHtml(webviewView.webview);
        webviewView.webview.onDidReceiveMessage((message) => {
            if (message.type === 'ready') {
                this.view?.webview.postMessage({ type: 'mood', mood: this.lastMood });
            }
        });
    }
    lastMood = 'happy';
    setMood(mood) {
        this.lastMood = mood;
        this.view?.webview.postMessage({ type: 'mood', mood });
    }
    getHtml(webview) {
        const mediaUri = vscode.Uri.joinPath(this.extensionUri, 'media');
        const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'pet.css'));
        const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(mediaUri, 'pet.js'));
        const petSvg = fs.readFileSync(path.join(mediaUri.fsPath, 'pet.svg'), 'utf8');
        const nonce = getNonce();
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
  <link rel="stylesheet" href="${cssUri}">
</head>
<body class="mood-happy">
  ${petSvg}
  <script nonce="${nonce}" src="${jsUri}"></script>
</body>
</html>`;
    }
}
exports.PetViewProvider = PetViewProvider;
function getNonce() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';
    for (let i = 0; i < 32; i++) {
        text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
}
//# sourceMappingURL=petViewProvider.js.map