// script.js (KODE BARU LENGKAP DAN DIPERBAIKI)

// Variabel Global Game Tebak Angka
let secretNumber;
let attempts;
let maxNumber = 100; // Default level
const baseGameKey = "guessNumberHighScore"; 

// Variabel Game Suit Jepang (RPS)
let rpsPlayerScore = 0;
let rpsComputerScore = 0;
const rpsChoices = ['batu', 'gunting', 'kertas'];

// Mendapatkan elemen DOM (Diperbarui)
const splashScreen = document.getElementById('splashScreen');
const splashStartButton = document.getElementById('splashStartButton');
const gameSelectScreen = document.getElementById('gameSelectScreen');

const selectGuessNumberButton = document.getElementById('selectGuessNumber'); 
const selectRPSButton = document.getElementById('selectRPS'); 

const levelSelectScreen = document.getElementById('levelSelectScreen'); 
const levelButtons = document.querySelectorAll('.level-btn'); 

const guessNumberContainer = document.getElementById('guessNumberContainer'); 
const rpsContainer = document.getElementById('rpsContainer'); 

const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');

const rpsResultDisplay = document.getElementById('rpsResult');
const rpsPlayerScoreDisplay = document.getElementById('rpsPlayerScore');
const rpsComputerScoreDisplay = document.getElementById('rpsComputerScore');
const rpsButtons = document.querySelectorAll('.rps-btn');
const rpsResetButton = document.getElementById('rpsResetButton');

const backToMenuButtons = document.querySelectorAll('.back-to-menu-btn');


// ------------------------------------------
// FUNGSI UTILITY (Transisi Layar)
// ------------------------------------------

function hideAllScreens() {
    // Sembunyikan semua layar penuh dan container game
    [splashScreen, gameSelectScreen, levelSelectScreen, guessNumberContainer, rpsContainer].forEach(el => {
        if (el.classList.contains('full-screen-layer')) {
            el.classList.remove('show-screen');
            el.classList.add('hidden-by-default');
        } else {
            el.style.display = 'none';
        }
    });
}

function showScreen(screenElement) {
    hideAllScreens();
    // Tunda sebentar untuk transisi yang mulus
    setTimeout(() => {
        if (screenElement.classList.contains('full-screen-layer')) {
            screenElement.classList.remove('hidden-by-default');
            screenElement.classList.add('show-screen');
        } else {
            screenElement.style.display = 'block';
        }
    }, 100); 
}

// ------------------------------------------
// LOGIKA GAME 2: SUIT JEPANG (RPS)
// ------------------------------------------

function updateRPSScoreDisplay() {
    rpsPlayerScoreDisplay.textContent = rpsPlayerScore;
    rpsComputerScoreDisplay.textContent = rpsComputerScore;
}

function checkRPSWinner(playerChoice) {
    const computerChoice = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
    let result = '';
    
    if (playerChoice === computerChoice) {
        result = `Seri! Anda (${playerChoice}) dan Komputer (${computerChoice}).`;
        rpsResultDisplay.style.color = '#ff9800';
    } else if (
        (playerChoice === 'batu' && computerChoice === 'gunting') ||
        (playerChoice === 'gunting' && computerChoice === 'kertas') ||
        (playerChoice === 'kertas' && computerChoice === 'batu')
    ) {
        result = `Anda Menang! Komputer memilih ${computerChoice}.`;
        rpsPlayerScore++;
        rpsResultDisplay.style.color = '#4CAF50';
    } else {
        result = `Anda Kalah! Komputer memilih ${computerChoice}.`;
        rpsComputerScore++;
        rpsResultDisplay.style.color = '#f44336';
    }

    rpsResultDisplay.innerHTML = result;
    updateRPSScoreDisplay();
}

function initializeRPS() {
    showScreen(rpsContainer);
    rpsResultDisplay.textContent = "Ayo mulai bermain!";
    rpsResultDisplay.style.color = '#333';
    updateRPSScoreDisplay();
}

// ------------------------------------------
// LOGIKA GAME 1: TEBAK ANGKA (Skor & Init)
// ------------------------------------------

function getHighScoreKey() {
    return `${baseGameKey}_${maxNumber}`;
}

function loadHighScore() {
    const currentKey = getHighScoreKey();
    const score = localStorage.getItem(currentKey);
    let levelName = "";
    
    if (maxNumber === 50) levelName = "Mudah";
    else if (maxNumber === 100) levelName = "Normal";
    else if (maxNumber === 1000) levelName = "Sulit";

    highScoreDisplay.innerHTML = `Skor Terbaik Level <b>${levelName}</b>: ${score && score !== 'null' ? score + ' tebakan' : 'Belum ada'}`;
}

function updateHighScore() {
    const currentKey = getHighScoreKey();
    let oldScore = parseInt(localStorage.getItem(currentKey));

    if (isNaN(oldScore) || attempts < oldScore) {
        localStorage.setItem(currentKey, attempts);
        loadHighScore();
        return true; 
    }
    return false; 
}

function initializeGuessNumberGame() {
    maxNumber = parseInt(maxNumber); 
    
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    
    // Pindah ke container game utama dan muat skor
    showScreen(guessNumberContainer);
    loadHighScore(); 
    
    instructionText.textContent = `Saya sudah memilih angka antara 1 sampai ${maxNumber}. Coba tebak!`;
    guessInput.setAttribute('max', maxNumber);
    guessInput.placeholder = `Masukkan tebakan Anda (1-${maxNumber})`;

    resultDisplay.textContent = "Mulai menebak!";
    resultDisplay.style.color = '#333';
    attemptsDisplay.textContent = attempts;
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    guessInput.focus();
}

function checkGuess() {
    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
        resultDisplay.textContent = `Masukkan angka yang valid (1-${maxNumber})!`;
        resultDisplay.style.color = '#ff9800'; 
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    const difference = Math.abs(guess - secretNumber);
    let feedbackText = "";
    
    if (difference === 0) {
        feedbackText = `🎉 SELAMAT! Anda benar dalam ${attempts} tebakan! Angka misteri itu adalah ${secretNumber}.`;
        resultDisplay.style.color = '#4CAF50';
        
        const isNewRecord = updateHighScore();
        if (isNewRecord) {
            feedbackText += '<br><b>🔥 REKOR BARU TERCIPTA!</b>'; 
        }

        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block'; 
        
    } else {
        let hotOrColdClass = '';
        if (difference <= 5) {
            feedbackText = "Mendidih! Anda sangat dekat. ";
            hotOrColdClass = '#FF0000'; 
        } else if (difference <= 15) {
            feedbackText = "Panas! Anda sudah berada di jalur yang benar. ";
            hotOrColdClass = '#FF8C00'; 
        } else if (difference <= 30) {
            feedbackText = "Hangat. Anda semakin dekat. ";
            hotOrColdClass = '#FFA500'; 
        } else {
            feedbackText = "Dingin. Jauh dari target. ";
            hotOrColdClass = '#00BFFF'; 
        }

        if (guess < secretNumber) {
            feedbackText += "Terlalu rendah! Coba lagi.";
        } else {
            feedbackText += "Terlalu tinggi! Coba lagi.";
        }

        resultDisplay.style.color = hotOrColdClass;

        if (attempts === 5 && maxNumber <= 100) { 
            let specificClue = (secretNumber % 2 === 0) ? 
                               "💡 Petunjuk: Angka misteri itu adalah <b>Genap</b>." : 
                               "💡 Petunjuk: Angka misteri itu adalah <b>Ganjil</b>.";
             feedbackText += `<br><span style="color: purple; font-size: 0.9em;">${specificClue}</span>`;
        }
    }
    
    resultDisplay.innerHTML = feedbackText;
    guessInput.value = '';
    guessInput.focus();
}

function selectLevel(event) {
    if (event.target.classList.contains('level-btn')) {
        maxNumber = parseInt(event.target.dataset.level);
        initializeGuessNumberGame();
    }
}

// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

// 1. Splash Screen -> Game Selection
splashStartButton.addEventListener('click', () => {
    showScreen(gameSelectScreen);
});

// 2. Game Selection -> Level Selection (Tebak Angka)
selectGuessNumberButton.addEventListener('click', () => {
    // Set maxNumber default sebelum menampilkan level screen
    maxNumber = 100; 
    loadHighScore(); 
    showScreen(levelSelectScreen);
});

// 3. Game Selection -> RPS Game
selectRPSButton.addEventListener('click', initializeRPS);

// 4. Game Tebak Angka Actions
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', () => {
    // Setelah menang, Main Lagi akan kembali ke Level Selection
    showScreen(levelSelectScreen); 
});
levelSelectScreen.addEventListener('click', selectLevel); 

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// 5. Game Suit Jepang Actions
rpsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        checkRPSWinner(e.currentTarget.dataset.choice);
    });
});
rpsResetButton.addEventListener('click', () => {
    rpsPlayerScore = 0;
    rpsComputerScore = 0;
    updateRPSScoreDisplay();
    rpsResultDisplay.textContent = "Skor diatur ulang. Pilih gerakan Anda!";
    rpsResultDisplay.style.color = '#333';
});

// 6. Tombol Kembali ke Menu Utama
backToMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        showScreen(gameSelectScreen);
    });
});

// 7. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    hideAllScreens();
    showScreen(splashScreen);
});

