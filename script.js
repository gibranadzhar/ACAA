// script.js (KODE LENGKAP)

// Variabel Global Game Tebak Angka
let secretNumber;
let attempts;
let maxNumber = 100; // Default level
const baseGameKey = "guessNumberHighScore"; 

// Variabel Game Suit Jepang (RPS)
let rpsGameMode = 'computer'; // 'computer' atau 'player'
let rpsCurrentPlayer = 1; // 1 atau 2
let rpsPlayerScore1 = 0;
let rpsPlayerScore2 = 0;
let rpsPlayer1Choice = null;
let rpsPlayer2Choice = null;

const rpsChoices = ['batu', 'gunting', 'kertas'];

// Mendapatkan elemen DOM
const splashScreen = document.getElementById('splashScreen');
const splashStartButton = document.getElementById('splashStartButton');
const gameSelectScreen = document.getElementById('gameSelectScreen');

const selectGuessNumberButton = document.getElementById('selectGuessNumber'); 
const selectRPSButton = document.getElementById('selectRPS'); 

const levelSelectScreen = document.getElementById('levelSelectScreen'); 
const guessNumberContainer = document.getElementById('guessNumberContainer'); 

const rpsModeScreen = document.getElementById('rpsModeScreen');
const modeVsComputerButton = document.getElementById('modeVsComputer');
const modeVsPlayerButton = document.getElementById('modeVsPlayer');
const rpsContainer = document.getElementById('rpsContainer'); 
const rpsModeDisplay = document.getElementById('rpsModeDisplay');

const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');

const rpsResultDisplay = document.getElementById('rpsResult');
const rpsPlayerScore1Display = document.getElementById('rpsPlayerScore1');
const rpsPlayerScore2Display = document.getElementById('rpsPlayerScore2');
const rpsInstructionDisplay = document.getElementById('rpsInstruction');
const rpsButtons = document.querySelectorAll('.rps-btn');
const rpsResetButton = document.getElementById('rpsResetButton');

const backToMenuButtons = document.querySelectorAll('.back-to-menu-btn');
const levelButtons = document.querySelectorAll('.level-btn'); 


// ------------------------------------------
// FUNGSI UTILITY (Transisi Layar)
// ------------------------------------------

function hideAllScreens() {
    // Sembunyikan semua layar penuh dan container game
    [splashScreen, gameSelectScreen, levelSelectScreen, rpsModeScreen, guessNumberContainer, rpsContainer].forEach(el => {
        if (el && el.classList.contains('full-screen-layer')) {
            el.classList.remove('show-screen');
            el.classList.add('hidden-by-default');
        } else if (el) {
            el.style.display = 'none';
        }
    });
}

function showScreen(screenElement) {
    hideAllScreens();
    // Tunda sebentar untuk transisi yang mulus
    setTimeout(() => {
        if (screenElement && screenElement.classList.contains('full-screen-layer')) {
            screenElement.classList.remove('hidden-by-default');
            screenElement.classList.add('show-screen');
        } else if (screenElement) {
            screenElement.style.display = 'block';
        }
    }, 100); 
}

// ------------------------------------------
// LOGIKA GAME 2: SUIT JEPANG (RPS)
// ------------------------------------------

function updateRPSScoreDisplay() {
    rpsPlayerScore1Display.textContent = `Pemain 1: ${rpsPlayerScore1}`;
    
    if (rpsGameMode === 'computer') {
        rpsPlayerScore2Display.textContent = `Komputer: ${rpsPlayerScore2}`;
    } else {
        rpsPlayerScore2Display.textContent = `Pemain 2: ${rpsPlayerScore2}`;
    }
}

function determineRPSWinner(choice1, choice2) {
    if (choice1 === choice2) return 'seri';
    if (
        (choice1 === 'batu' && choice2 === 'gunting') ||
        (choice1 === 'gunting' && choice2 === 'kertas') ||
        (choice1 === 'kertas' && choice2 === 'batu')
    ) {
        return 'p1'; 
    } else {
        return 'p2'; 
    }
}

function handleRPSChoice(playerChoice) {
    if (rpsGameMode === 'computer') {
        // --- LOGIKA VS KOMPUTER ---
        const computerChoice = rpsChoices[Math.floor(Math.random() * rpsChoices.length)];
        const winner = determineRPSWinner(playerChoice, computerChoice);
        let result = '';

        if (winner === 'seri') {
            result = `Seri! Anda (${playerChoice}) dan Komputer (${computerChoice}).`;
            rpsResultDisplay.style.color = '#ff9800';
        } else if (winner === 'p1') {
            result = `Anda Menang! Komputer memilih ${computerChoice}.`;
            rpsPlayerScore1++;
            rpsResultDisplay.style.color = '#4CAF50';
        } else {
            result = `Anda Kalah! Komputer memilih ${computerChoice}.`;
            rpsPlayerScore2++;
            rpsResultDisplay.style.color = '#f44336';
        }
        rpsInstructionDisplay.textContent = "Pilih lagi:";
        rpsResultDisplay.innerHTML = result;

    } else {
        // --- LOGIKA VS PEMAIN (1 HP) ---
        
        if (rpsCurrentPlayer === 1) {
            rpsPlayer1Choice = playerChoice;
            rpsInstructionDisplay.textContent = "Giliran Pemain 2. Pemain 1 sudah memilih. JANGAN DILIHAT!";
            rpsResultDisplay.innerHTML = "Pemain 1 sudah memilih. Sembunyikan layar dan berikan kepada Pemain 2.";
            rpsResultDisplay.style.color = '#333';
            rpsCurrentPlayer = 2;

        } else if (rpsCurrentPlayer === 2) {
            rpsPlayer2Choice = playerChoice;
            
            const winner = determineRPSWinner(rpsPlayer1Choice, rpsPlayer2Choice);
            let result = '';

            if (winner === 'seri') {
                result = `Seri! P1 (${rpsPlayer1Choice}) vs P2 (${rpsPlayer2Choice}).`;
                rpsResultDisplay.style.color = '#ff9800';
            } else if (winner === 'p1') {
                result = `Pemain 1 Menang! P1 (${rpsPlayer1Choice}) vs P2 (${rpsPlayer2Choice}).`;
                rpsPlayerScore1++;
                rpsResultDisplay.style.color = '#4CAF50';
            } else {
                result = `Pemain 2 Menang! P1 (${rpsPlayer1Choice}) vs P2 (${rpsPlayer2Choice}).`;
                rpsPlayerScore2++;
                rpsResultDisplay.style.color = '#f44336';
            }
            
            rpsInstructionDisplay.textContent = "Giliran Pemain 1. Pilih gerakan Anda:";
            rpsResultDisplay.innerHTML = result;
            rpsCurrentPlayer = 1;
        }
    }
    updateRPSScoreDisplay();
}

function initializeRPS(mode) {
    rpsGameMode = mode;
    rpsCurrentPlayer = 1;
    rpsPlayer1Choice = null;
    rpsPlayer2Choice = null;
    
    // Reset skor untuk mode baru
    rpsPlayerScore1 = 0;
    rpsPlayerScore2 = 0;
    
    showScreen(rpsContainer);
    
    if (mode === 'computer') {
        rpsModeDisplay.textContent = "Mode: Player vs Komputer";
        rpsInstructionDisplay.textContent = "Pilih gerakan Anda:";
    } else {
        rpsModeDisplay.textContent = "Mode: Player vs Player";
        rpsInstructionDisplay.textContent = "Giliran Pemain 1. Pilih gerakan Anda:";
    }
    
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
    maxNumber = 100; 
    loadHighScore(); 
    showScreen(levelSelectScreen);
});

// 3. Game Selection -> RPS Mode Selection
selectRPSButton.addEventListener('click', () => {
    showScreen(rpsModeScreen);
});

// 4. RPS Mode Selection -> RPS Game
modeVsComputerButton.addEventListener('click', () => initializeRPS('computer'));
modeVsPlayerButton.addEventListener('click', () => initializeRPS('player'));

// 5. Game Tebak Angka Actions
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', () => {
    // Kembali ke Level Selection setelah menang
    showScreen(levelSelectScreen); 
});
levelSelectScreen.addEventListener('click', selectLevel); 

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// 6. Game Suit Jepang Actions
rpsButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        handleRPSChoice(e.currentTarget.dataset.choice);
    });
});
rpsResetButton.addEventListener('click', () => {
    rpsPlayerScore1 = 0;
    rpsPlayerScore2 = 0;
    updateRPSScoreDisplay();
    rpsResultDisplay.textContent = "Skor diatur ulang. Pilih gerakan Anda!";
    rpsResultDisplay.style.color = '#333';
});

// 7. Tombol Kembali ke Menu Utama
backToMenuButtons.forEach(button => {
    button.addEventListener('click', () => {
        showScreen(gameSelectScreen);
    });
});

// 8. Initial Load
document.addEventListener('DOMContentLoaded', () => {
    hideAllScreens();
    showScreen(splashScreen);
});

