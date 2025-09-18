
import { initAudio, loadSound, playSound, startBackgroundMusic, stopBackgroundMusic, playWinSound } from './audio.js';

// --- PAGE NAVIGATION LOGIC ---
function showPage(pageNum) {
    for (let i = 1; i <= 4; i++) {
        const section = document.getElementById(`page${i}`);
        if (section) section.classList.toggle('hidden', i !== pageNum);
    }
}

// Initial page load: show homepage
document.addEventListener('DOMContentLoaded', () => {
    showPage(1);

    // Button navigation
    const startBtn = document.getElementById('start-btn');
    const toGameBtn = document.getElementById('to-game-btn');
    const restartBtn = document.getElementById('restart-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            showPage(2);
        });
    }
    if (toGameBtn) {
        toGameBtn.addEventListener('click', () => {
            showPage(3);
            // Optionally, you could auto-play the video and only enable the button after video ends
        });
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            showPage(1);
            // Optionally, reset game state here if needed
            window.location.reload(); // full reload to reset everything
        });
    }

    // --- GAME LOGIC BELOW (only runs when page 3 is shown) ---

    // Only initialize game logic if page3 exists (prevents errors on other pages)
    const page3 = document.getElementById('page3');
    if (!page3) return;

    const hairOptions = page3.querySelectorAll('.hair-option');
    const dropZone = page3.querySelector('#drop-zone');
    const characterArea = page3.querySelector('#character-area');
    const hairSelectionContainer = page3.querySelector('#hair-selection');
    const successMessage = page3.querySelector('#success-message');
    const manImage = page3.querySelector('#man-image');
    const placedHairContainer = page3.querySelector('#placed-hair-container');
    const resetButton = page3.querySelector('#reset-button');

    let gameInProgress = true;
    let hairCount = 0;
    const hairsToWin = 15;
    let timeLeft = 60;
    let timerInterval;
    let movementInterval;

    const timeDisplay = page3.querySelector('#time');

    function moveHead() {
        const movement = Math.sin(Date.now() / 1000) * 20; // Smooth sinusoidal movement
        characterArea.style.transform = `translateX(${movement}px)`;
    }

    function startMovement() {
        movementInterval = setInterval(moveHead, 16);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameInProgress = false;
                stopBackgroundMusic();
                hairSelectionContainer.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successMessage.querySelector('h2').textContent = "Time's up!";
                successMessage.querySelector('p').textContent = 'Better luck next time!';
            }
        }, 1000);
    }

    // Initialize Audio
    initAudio();
    loadSound('pickup', 'pickup.mp3');
    loadSound('drop', 'drop.mp3');
    loadSound('success', 'success.mp3');
    startBackgroundMusic(100);

    // Start the timer and movement
    startTimer();
    startMovement();

    hairOptions.forEach(hairEl => {
        hairEl.addEventListener('dragstart', (e) => {
            if (!gameInProgress) return e.preventDefault();
            e.dataTransfer.setData('text/plain', e.target.src);
            e.dataTransfer.setData('text/variant', e.target.dataset.variant || '');
            e.dataTransfer.effectAllowed = 'copy';
            e.target.classList.add('dragging');
            playSound('pickup'); // playful pluck
        });

        hairEl.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
        });
    });

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (gameInProgress) {
            e.dataTransfer.dropEffect = 'copy';
            dropZone.classList.add('over');
        }
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!gameInProgress) return;
        
        dropZone.classList.remove('over');
        const hairSrc = e.dataTransfer.getData('text/plain');
        const hairVariant = e.dataTransfer.getData('text/variant');

        if (hairSrc) {
            const placedHair = document.createElement('img');
            placedHair.src = hairSrc;
            // apply a class for variant so it inherits same tint/visual style
            if (hairVariant) placedHair.classList.add(`placed-${hairVariant}`);
            
            // Position the hair where it was dropped
            const dropZoneRect = characterArea.getBoundingClientRect();
            const x = e.clientX - dropZoneRect.left;
            const y = e.clientY - dropZoneRect.top;

            // Center the image on the cursor
            placedHair.style.left = `${x - 15}px`; // half of width
            placedHair.style.top = `${y - 15}px`; // half of height
            
            placedHairContainer.appendChild(placedHair);
            
            playSound('drop');
            hairCount++;

            if (hairCount >= hairsToWin) {
                completeGame();
            }
        }
    });


    function completeGame() {
        gameInProgress = false;
        clearInterval(timerInterval);
        clearInterval(movementInterval);
        stopBackgroundMusic();
        manImage.src = 'sucsess happy man.png'; // Use your happy man image
        characterArea.style.transform = 'translateX(0)';
        hairSelectionContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        playWinSound();
        playSound('success');
        // After a short delay, go to ending page
        setTimeout(() => {
            showPage(4);
        }, 2000);
    }


    function resetGame() {
        clearInterval(timerInterval);
        clearInterval(movementInterval);
        gameInProgress = true;
        hairCount = 0;
        timeLeft = 60;
        timeDisplay.textContent = timeLeft;
        startTimer();
        startMovement();
        placedHairContainer.innerHTML = '';
        manImage.src = 'game_start_man.png';
        hairSelectionContainer.classList.remove('hidden');
        successMessage.classList.add('hidden');
        startBackgroundMusic(100);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }
});