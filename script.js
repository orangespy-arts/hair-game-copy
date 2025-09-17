import { initAudio, loadSound, playSound, startBackgroundMusic, stopBackgroundMusic, playWinSound } from './audio.js';

document.addEventListener('DOMContentLoaded', () => {
    const hairOptions = document.querySelectorAll('.hair-option');
    const dropZone = document.getElementById('drop-zone');
    const characterArea = document.getElementById('character-area');
    const hairSelectionContainer = document.getElementById('hair-selection');
    const successMessage = document.getElementById('success-message');
    const manImage = document.getElementById('man-image');
    const placedHairContainer = document.getElementById('placed-hair-container');
    const resetButton = document.getElementById('reset-button');

    let gameInProgress = true;
    let hairCount = 0;
    const hairsToWin = 15;
    let timeLeft = 60;
    let timerInterval;
    let movementInterval;

    const timeDisplay = document.getElementById('time');
    
    function moveHead() {
        const movement = Math.sin(Date.now() / 1000) * 20; // Smooth sinusoidal movement
        characterArea.style.transform = `translateX(${movement}px)`;
    }

    function startMovement() {
        // Update head position every 16ms (approximately 60fps)
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
                successMessage.querySelector('h2').textContent = 'Time\'s up!';
                successMessage.querySelector('p').textContent = 'Better luck next time!';
            }
        }, 1000);
    }

    // Initialize Audio
    initAudio();
    loadSound('pickup', 'pickup.mp3');
    loadSound('drop', 'drop.mp3');
    loadSound('success', 'success.mp3');
    // start gentle background music at 100 BPM
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
        clearInterval(timerInterval);  // Stop the timer when player wins
        clearInterval(movementInterval); // Stop the head movement
        stopBackgroundMusic();
        // Change to happy man
        manImage.src = 'happy_man.png';
        characterArea.style.transform = 'translateX(0)'; // Reset position
        hairSelectionContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        // play a layered exciting win sound
        playWinSound();
        playSound('success');
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
        manImage.src = 'bald_man.png';
        hairSelectionContainer.classList.remove('hidden');
        successMessage.classList.add('hidden');
        startBackgroundMusic(100);
    }

    resetButton.addEventListener('click', resetGame);
});