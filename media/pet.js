(function () {
    const vscode = accquireVsCodeApi();

    window.addEventListener('message', (event) => {
        const message = event.data;

        if (message.type === 'mood') {
            document.body.className = 'mood-' + message.mood;
        }
    });

    vscode.postMessage({ type: 'ready'});
})();