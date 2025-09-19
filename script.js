import { initAudio, loadSound, playSound, startBackgroundMusic, stopBackgroundMusic, playWinSound } from './audio.js';

// Dialog management functions
function showDialog(message, type = 'success') {
    console.log('showDialog called with:', message, 'type:', type);
    const dialogContainer = document.getElementById('dialog-container');
    const dialog = document.createElement('div');
    dialog.className = `dialog-box ${type}`; // Add type class for styling
    
    // Check if message is an image file
    if (message.endsWith('.png') || message.endsWith('.jpg') || message.endsWith('.gif')) {
        console.log('Creating image element for:', message);
        const img = document.createElement('img');
        img.src = message;
        img.alt = 'Wrong area message';
        
        // Add specific class based on image name
        if (message.includes('wrong1.png')) {
            img.className = 'wrong-message-image wrong1-image';
        } else if (message.includes('wrong2.png')) {
            img.className = 'wrong-message-image wrong2-image';
        } else if (message.includes('wrong3.png')) {
            img.className = 'wrong-message-image wrong3-image';
        } else if (message.includes('positive1.png')) {
            img.className = 'positive-message-image positive1-image';
            console.log('Assigned positive1-image class');
        } else if (message.includes('positive2.png')) {
            img.className = 'positive-message-image positive2-image';
            console.log('Assigned positive2-image class');
        } else {
            img.className = 'wrong-message-image';
        }
        console.log('Image className:', img.className);
        
        dialog.appendChild(img);
    } else {
        dialog.textContent = message;
    }
    
    // Remove any existing dialogs
    dialogContainer.innerHTML = '';
    dialogContainer.appendChild(dialog);

    // Remove dialog after 2 seconds
    setTimeout(() => {
        dialog.remove();
    }, 2000);
}

function getRandomWrongAreaMessage() {
    const wrongImages = [
        "wrong1.png",
        "wrong2.png", 
        "wrong3.png"
    ];
    return wrongImages[Math.floor(Math.random() * wrongImages.length)];
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
        characterArea.style.setProperty('--movement', '0px');
        hairSelectionContainer.classList.add('hidden');
        // Show failure message instead of success message
        const failureMessage = document.getElementById('failure-message');
        if (failureMessage) {
            failureMessage.classList.remove('hidden');
            console.log('Failure message div shown:', !failureMessage.classList.contains('hidden'));
        }
        
        // Hide success message
        successMessage.classList.add('hidden');
        document.getElementById('man-image').src = 'sad_man.png';
        
        // Show try again button for losing
        console.log('Showing try again button for losing');
        const tryAgainBtn = document.getElementById('try-again-button-fail');
        const backBtn = document.getElementById('back-button-fail');
        console.log('Try again button found:', tryAgainBtn);
        console.log('Back button found:', backBtn);
        
        if (tryAgainBtn) {
            tryAgainBtn.classList.remove('hidden');
            console.log('Try again button hidden class removed');
        } else {
            console.error('Try again button not found!');
        }
        
        if (backBtn) {
            backBtn.classList.add('hidden');
            console.log('Back button hidden class added');
        } else {
            console.error('Back button not found!');
        }
    }
}

function getProgressMessage(hairCount) {
    const messages = {
        4: "positive1.png",
        8: "positive2.png",
    };
    return messages[hairCount] || "positive1.png";
}

// --- PAGE NAVIGATION LOGIC ---
function showPage(pageNum) {
    // Hide all pages first
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    
    const homeBgm = document.getElementById('home-bgm');
    // Stop home BGM when leaving page 1
    if (pageNum !== 1 && homeBgm) {
        homeBgm.pause();
        homeBgm.currentTime = 0;
    }

    // Show the requested page
    const pageToShow = document.getElementById(`page${pageNum}`);
    if (pageToShow) {
        pageToShow.classList.remove('hidden');
        
        // Start home BGM only on page 1
        if (pageNum === 1 && homeBgm) {
            homeBgm.play().catch(e => console.log("BGM play failed:", e));
        }

        // Handle video on page 2
        if (pageNum === 2) {
            const video = document.getElementById('intro-video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => console.log('Video autoplay failed:', e));
            }
        }
    }
}

// Initial page load: show homepage
document.addEventListener('DOMContentLoaded', () => {
    // Hide all pages first
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show page 1 and initialize home BGM
    document.getElementById('page1').classList.remove('hidden');
    const homeBgm = document.getElementById('home-bgm');
    if (homeBgm) {
        homeBgm.volume = 0.5;
        // Try to play BGM on page load
        homeBgm.play().catch(e => {
            console.log("Autoplay prevented, waiting for user interaction");
        });
    }

    // Button navigation with improved click handling
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (homeBgm) {
                homeBgm.pause();
                homeBgm.currentTime = 0;
            }
            playSound('success');
            showPage(2);
        });
    }

    const toGameBtn = document.getElementById('to-game-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Video handling
    const video = document.getElementById('intro-video');
    if (video) {
        const loadingOverlay = document.querySelector('.loading-overlay');
        const homeBgm = document.getElementById('home-bgm');
        
        // Stop BGM when video plays
        video.addEventListener('play', () => {
            if (homeBgm) {
                homeBgm.pause();
                homeBgm.currentTime = 0;
            }
        });

        video.addEventListener('ended', () => {
            showPage(3);
            manImage.src = 'simple_man.png'; // Ensure man starts as simple_man
            startTimer();
            startMovement();
        });

        video.addEventListener('loadstart', () => {
            loadingOverlay.classList.remove('hidden');
        });

        video.addEventListener('error', (e) => {
            console.error('Video error:', video.error);
            loadingText.textContent = 'Error loading video. Please try again.';
        });

        video.addEventListener('canplay', () => {
            loadingOverlay.classList.add('hidden');
        });
    }

    // Initialize Audio with success sound
    initAudio();
    loadSound('pickup', 'pickup.mp3');
    loadSound('drop', 'drop.mp3');
    loadSound('success', 'success.mp3');
    loadSound('losing', 'losing_sound.wav');

    if (toGameBtn) {
        toGameBtn.addEventListener('click', () => {
            showPage(3);
            manImage.src = 'simple_man.png'; // Ensure man starts as simple_man
            startTimer();
            startMovement();
            startBackgroundMusic(100);  // Restore this line
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
    const backButtonFail = document.getElementById('back-button-fail');
    const tryAgainButtonFail = document.getElementById('try-again-button-fail');
    
    console.log('Button initialization:');
    console.log('Back button found:', backButton);
    console.log('Try again button found:', tryAgainButton);
    console.log('Back button fail found:', backButtonFail);
    console.log('Try again button fail found:', tryAgainButtonFail);

    // Success message buttons
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('Back button clicked - going to page 1');
            playSound('success');
            showPage(1);
            window.location.reload();
        });
        console.log('Back button event listener added');
    } else {
        console.error('Back button not found during initialization!');
    }

    if (tryAgainButton) {
        tryAgainButton.addEventListener('click', () => {
            console.log('Try again button clicked - resetting game');
            playSound('success');
            resetGame();
        });
        console.log('Try again button event listener added');
    } else {
        console.error('Try again button not found during initialization!');
    }

    // Failure message buttons
    if (backButtonFail) {
        backButtonFail.addEventListener('click', () => {
            console.log('Back button fail clicked - going to page 1');
            playSound('success');
            showPage(1);
            window.location.reload();
        });
        console.log('Back button fail event listener added');
    } else {
        console.error('Back button fail not found during initialization!');
    }

    if (tryAgainButtonFail) {
        tryAgainButtonFail.addEventListener('click', () => {
            console.log('Try again button fail clicked - resetting game');
            playSound('success');
            resetGame();
        });
        console.log('Try again button fail event listener added');
    } else {
        console.error('Try again button fail not found during initialization!');
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
    const hairsToWin = 12;
    let timeLeft = 30;
    let timerInterval;
    let movementInterval;

    const timeDisplay = page3.querySelector('#time');
    const hairsRemainingDisplay = page3.querySelector('#hairs-remaining');

    // Unified function to update hair counter display
    function updateHairCounter(remainingHairs = hairsToWin) {
        const timerElement = document.getElementById('hair-counter');
        timerElement.querySelector('.calculator-text').innerHTML = `Hairs Needed: <span id="hairs-remaining">${remainingHairs}</span> to win`;
    }

    function moveHead() {
        const movement = Math.sin(Date.now() / 1000) * 20; // Smooth sinusoidal movement
        characterArea.style.setProperty('--movement', `${movement}px`);
    }

    function startMovement() {
        // Movement disabled - man stays still
        // movementInterval = setInterval(moveHead, 16);
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeLeft--;
            const timeDisplay = document.getElementById('time');
            if (timeLeft > 0) {
                const timerElement = document.getElementById('hair-counter');
                timerElement.querySelector('.timer-text').innerHTML = `Time Left: <span id="time">${timeLeft}</span> seconds`;
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                clearInterval(movementInterval);
                gameInProgress = false;
                
                // Stop BGM before playing losing sound
                const bgm = document.getElementById('bgm');
                if (bgm) {
                    bgm.pause();
                    bgm.currentTime = 0;
                }
                
                // Play losing sound
                playSound('losing');
                const losingSound = document.getElementById('losing-sound');
                if (losingSound) {
                    losingSound.currentTime = 0;
                    losingSound.play().catch(e => console.log("Audio play failed:", e));
                }
                manImage.src = 'sad_man.png';
                characterArea.style.setProperty('--movement', '0px');
                hairSelectionContainer.classList.add('hidden');
                
                // Show failure message instead of success message
                const failureMessage = document.getElementById('failure-message');
                if (failureMessage) {
                    failureMessage.classList.remove('hidden');
                    console.log('Failure message div shown for timer loss');
                }
                
                // Hide success message
                successMessage.classList.add('hidden');
                
                // Change timer display to "TIME'S UP!"
                const timerElement = document.getElementById('hair-counter');
                timerElement.querySelector('.timer-text').textContent = "TIME'S UP!";
                timerElement.querySelector('.calculator-text').textContent = "Game Over";
                timerElement.style.backgroundColor = '#ff0000';
                
                // Show try again button for losing
                console.log('Showing try again button for timer loss');
                const tryAgainBtn = document.getElementById('try-again-button-fail');
                const backBtn = document.getElementById('back-button-fail');
                console.log('Try again button found:', tryAgainBtn);
                console.log('Back button found:', backBtn);
                
                if (tryAgainBtn) {
                    tryAgainBtn.classList.remove('hidden');
                    console.log('Try again button hidden class removed');
                } else {
                    console.error('Try again button not found!');
                }
                
                if (backBtn) {
                    backBtn.classList.add('hidden');
                    console.log('Back button hidden class added');
                } else {
                    console.error('Back button not found!');
                }
            }
        }, 1000);
    }

    // Initialize Audio
    initAudio();
    loadSound('pickup', 'pickup.mp3');
    loadSound('drop', 'drop.mp3');
    loadSound('success', 'success.mp3');
    loadSound('losing', 'losing_sound.wav');

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
            
            // Position the hair relative to the man's image
            const manImageRect = manImage.getBoundingClientRect();
            
            // Get position relative to the man's image (exact drop position)
            const x = e.clientX - manImageRect.left;
            const y = e.clientY - manImageRect.top;
            
            // Convert to percentage relative to man's image
            const xPercent = (x / manImageRect.width) * 100;
            const yPercent = (y / manImageRect.height) * 100;
            
            // Set the exact position where dropped relative to man's image
            placedHair.style.left = `${xPercent}%`;
            placedHair.style.top = `${yPercent}%`;
            
            placedHairContainer.appendChild(placedHair);
            
            playSound('pickup');  // Changed from 'drop' to 'pickup'
            hairCount++;
            
            // Update the hair counter
            const remainingHairs = hairsToWin - hairCount;
            updateHairCounter(remainingHairs);

            // Show message every 4 hairs
            if (hairCount % 4 === 0) {
                const progressMessage = getProgressMessage(hairCount);
                console.log('Showing progress message:', progressMessage, 'for hair count:', hairCount);
                showDialog(progressMessage, 'success');
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
        
        // Stop BGM before playing winning sound
        const bgm = document.getElementById('bgm');
        if (bgm) {
            bgm.pause();
            bgm.currentTime = 0;
        }
        
        // Play winning sound
        const winningSound = document.getElementById('winning-sound');
        if (winningSound) {
            winningSound.currentTime = 0;
            winningSound.play().catch(e => console.log("Audio play failed:", e));
        }
        
        // Hide combined timer/counter
        document.getElementById('hair-counter').style.display = 'none';
        
        // Simple image change - no expansion effect
        manImage.src = 'happy_man.png';
        characterArea.style.setProperty('--movement', '0px');

        hairSelectionContainer.classList.add('hidden');
        const instructionText = document.querySelector('#hair-selection p');
        if (instructionText) {
         instructionText.classList.add('hidden');
        }
        successMessage.classList.remove('hidden');
        
        // Try to set text content if elements exist
        const h2Element = successMessage.querySelector('h2');
        const pElement = successMessage.querySelector('p');
        if (h2Element) h2Element.textContent = "Looking sharp!";
        if (pElement) pElement.textContent = "He feels like a new man! Thanks to you.";
        
        // Show back button for winning
        console.log('Showing back button for winning');
        const tryAgainBtn = document.getElementById('try-again-button');
        const backBtn = document.getElementById('back-button');
        console.log('Try again button found:', tryAgainBtn);
        console.log('Back button found:', backBtn);
        
        if (backBtn) {
            backBtn.classList.remove('hidden');
            console.log('Back button hidden class removed');
        } else {
            console.error('Back button not found!');
        }
        
        if (tryAgainBtn) {
            tryAgainBtn.classList.add('hidden');
            console.log('Try again button hidden class added');
        } else {
            console.error('Try again button not found!');
        }
        playWinSound();
        playSound('success');
    }


    function resetGame() {
        clearInterval(timerInterval);
        clearInterval(movementInterval);
        gameInProgress = true;
        hairCount = 0;
        timeLeft = 30;
        
        // Reset timer to original state
        const timerElement = document.getElementById('hair-counter');
        timerElement.style.backgroundColor = '#ff4f4f';  // Reset to original color
        timerElement.style.display = 'block';  // Make sure it's visible
        timerElement.querySelector('.timer-text').innerHTML = `Time Left: <span id="time">${timeLeft}</span> seconds`;
        updateHairCounter(); // Reset to default 12 hairs
        

        startTimer();
        startMovement();
        placedHairContainer.innerHTML = '';
        manImage.src = 'simple_man.png';
        hairSelectionContainer.classList.remove('hidden');
        successMessage.classList.add('hidden');
        
        // Hide failure message as well
        const failureMessage = document.getElementById('failure-message');
        if (failureMessage) {
            failureMessage.classList.add('hidden');
        }
        
        startBackgroundMusic(100);  // Restore this line
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }
});