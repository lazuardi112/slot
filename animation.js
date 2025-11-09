const winPopup = document.getElementById('win-popup');
const winAnimation = document.getElementById('win-animation');

const bigWinFrames = [];
for (let i = 0; i <= 60; i++) {
    bigWinFrames.push(`public/assets/big_win/big_win_${i}.png`);
}

function playWinAnimation(winType) {
    winPopup.classList.remove('hidden');

    let frames = bigWinFrames;
    let frameIndex = 0;

    const interval = setInterval(() => {
        if (frameIndex < frames.length) {
            winAnimation.src = frames[frameIndex];
            frameIndex++;
        } else {
            clearInterval(interval);
            winPopup.classList.add('hidden');
        }
    }, 50); // Adjust frame rate as needed
}
