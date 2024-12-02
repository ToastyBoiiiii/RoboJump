let loadingScreenElement = document.getElementById('loading');
let progressBarElement = document.getElementById('progressBar');
let progressBarLabelElement = document.querySelector('label[for="progressBar"]');
let onCompleteCallback;

function initializeProgressbar(max, onComplete) {
    progressBarElement.max = max;
    onCompleteCallback = onComplete;
}

function updateLoadingScreen(progressMessage) {
    if(progressBarElement.value === progressBarElement.max) {
        completeLoadingScreen();
        return;
    }

    progressBarLabelElement.innerText = `${100*Math.round((+progressBarElement.value)/(+progressBarElement.max))}% - ${progressMessage}`;
    progressBarElement.value = +progressBarElement.value + 1;
}

function completeLoadingScreen() {
    loadingScreenElement.remove();
    onCompleteCallback();
}

export { initializeProgressbar, updateLoadingScreen };