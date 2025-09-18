
import { initAudio, loadSound, playSound, startBackgroundMusic, stopBackgroundMusic, playWinSound } from './audio.js';

// Dialog management functions
function showDialog(message, type = 'success') {
    const dialogContainer = document.getElementById('dialog-container');
    const dialog = document.createElement('div');
    dialog.className = `dialog-box ${type}`; // Add type class for styling
    dialog.textContent = message;
    
    // Remove any existing dialogs
    dialogContainer.innerHTML = '';
    dialogContainer.appendChild(dialog);

    // Remove dialog after 2 seconds
    setTimeout(() => {
        dialog.remove();
    }, 2000);
}

function getRandomWrongAreaMessage() {
    const messages = [
        "Ouch! That's not the right spot! You're making me upset!",
        "Hey! My face is not a place for hair!",
        "Come on, focus on my bald spot!",
        "This isn’t what I meant by hair transplant!",
        "Nope, that's definitely not where hair goes!",
        "I need hair on my head, not there!",
        "That tickles! But it's the wrong spot!",
        "Are you even trying? That's not my head!"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function handleWrongAreaDrop() {
    showDialog(getRandomWrongAreaMessage(), 'error');
    timeLeft = Math.max(0, timeLeft - 5); // Subtract 5 seconds but don't go below 0
    timeDisplay.textContent = timeLeft;
    playSound('drop'); // Optional: You might want to add a different sound for wrong drops
    
    if (timeLeft <= 0) {
        clearInterval(timerInterval);
        clearInterval(movementInterval);
        gameInProgress = false;
        stopBackgroundMusic();
        characterArea.style.transform = 'translateX(0)';
        hairSelectionContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.querySelector('h2').textContent = "Time's up!";
        successMessage.querySelector('p').textContent = 'Better luck next time!';
        document.getElementById('man-image').src = 'sad_man.png';
    }
}

function getProgressMessage(hairCount) {
    const messages = {
        5: "Looking good! Keep going!",
        10: "That's the spirit! He's starting to smile!",
        15: "Almost there! Just a few more strands!"
    };
    return messages[hairCount] || "Nice work!";
}

// --- PAGE NAVIGATION LOGIC ---
function showPage(pageNum) {
    // Hide all pages first
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    // Show the requested page
    const pageToShow = document.getElementById(`page${pageNum}`);
    if (pageToShow) {
        pageToShow.classList.remove('hidden');
    }
}

// Initial page load: show homepage
document.addEventListener('DOMContentLoaded', () => {
    // Hide all pages first
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    // Show page 1
    document.getElementById('page1').classList.remove('hidden');

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
            // Start timer and movement when continuing to game
            startTimer();
            startMovement();
            startBackgroundMusic(100);
        });
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            showPage(1);
            // Optionally, reset game state here if needed
            window.location.reload(); // full reload to reset everything
        });
    }

    // Add event listeners for the new image buttons
    const backButton = document.getElementById('back-button');
    const tryAgainButton = document.getElementById('try-again-button');

    if (backButton) {
        backButton.addEventListener('click', () => {
            showPage(1); // Go back to homepage
            window.location.reload(); // Reset game state
        });
    }

    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
            resetGame(); // Reset the game but stay on page 3
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
    
    // Add event listener for wrong area drops
    characterArea.addEventListener('dragover', (e) => {
        // Only prevent default if we're not over the drop zone
        if (!e.target.matches('#drop-zone')) {
            e.preventDefault();
            if (gameInProgress) {
                e.dataTransfer.dropEffect = 'copy';
            }
        }
    });

    characterArea.addEventListener('drop', (e) => {
        // If we're not dropping on the drop zone, it's a wrong area
        if (!e.target.matches('#drop-zone') && gameInProgress) {
            e.preventDefault();
            handleWrongAreaDrop();
        }
    });
    const resetButton = page3.querySelector('#reset-button');

    let gameInProgress = true;
    let hairCount = 0;
    const hairsToWin = 5;
    let timeLeft = 15;
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
                clearInterval(movementInterval);
                gameInProgress = false;
                stopBackgroundMusic();
                // Change to sad man image for losing
                manImage.src = 'sad_man.png';
                characterArea.style.transform = 'translateX(0)';
                hairSelectionContainer.classList.add('hidden');
                successMessage.classList.remove('hidden');
                successMessage.querySelector('h2').textContent = "Time's up!";
                successMessage.querySelector('p').textContent = 'Better luck next time!';
                // Show try again button for losing
                document.getElementById('try-again-button').classList.remove('hidden');
                document.getElementById('back-button').classList.add('hidden');
            }
        }, 1000);
    }

    // Initialize Audio
    initAudio();
    loadSound('pickup', 'pickup.mp3');
    loadSound('drop', 'drop.mp3');
    loadSound('success', 'success.mp3');

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

            // Show message every 5 hairs
            if (hairCount % 5 === 0) {
                showDialog(getProgressMessage(hairCount), 'success');
            }

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
        
        // Create transition effect
        const transitionImg = document.createElement('img');
        transitionImg.style.position = 'absolute';
        transitionImg.style.top = '0';
        transitionImg.style.left = '0';
        transitionImg.style.width = '100%';
        transitionImg.style.height = '100%';
        transitionImg.style.opacity = '0';
        transitionImg.src = 'happy_man.png';
        transitionImg.style.transition = 'opacity 1.5s ease-in-out';
        
        // Add transition image on top of current image
        characterArea.appendChild(transitionImg);
        characterArea.style.transform = 'translateX(0)';
        
        // Trigger fade in
        setTimeout(() => {
            transitionImg.style.opacity = '1';
        }, 100);
        
        // After transition completes, clean up
        setTimeout(() => {
            manImage.src = 'happy_man.png';
            transitionImg.remove();
        }, 1600);

        hairSelectionContainer.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.querySelector('h2').textContent = "Looking sharp!";
        successMessage.querySelector('p').textContent = "He feels like a new man! Thanks to you.";
        // Show back button for winning
        document.getElementById('back-button').classList.remove('hidden');
        document.getElementById('try-again-button').classList.add('hidden');
        playWinSound();
        playSound('success');
    }


    function resetGame() {
        clearInterval(timerInterval);
        clearInterval(movementInterval);
        gameInProgress = true;
        hairCount = 0;
        timeLeft = 15;
        timeDisplay.textContent = timeLeft;
        startTimer();
        startMovement();
        placedHairContainer.innerHTML = '';
        manImage.src = 'simple_man.png';
        hairSelectionContainer.classList.remove('hidden');
        successMessage.classList.add('hidden');
        startBackgroundMusic(100);
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }
});