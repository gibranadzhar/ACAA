// script.js (KODE BARU LENGKAP)

// Variabel Global
let secretNumber;
let attempts;
let maxNumber; 
const baseGameKey = "guessNumberHighScore"; 

// Variabel RPS
let rpsPlayerScore = 0;
let rpsComputerScore = 0;
const rpsChoices = ['batu', 'gunting', 'kertas'];

// Mendapatkan elemen DOM (Diperbarui)
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');

const introScreen = document.querySelector('.intro-screen');
const startButtonGuessNumber = document.getElementById('selectGuessNumber'); // Tombol Pilih Angka
const startButtonRPS = document.getElementById('selectRPS'); // Tombol Pilih RPS

const levelScreen = document.querySelector('.level-selection-screen'); 
const levelButtons = document.querySelectorAll('.level-btn'); 

const guessNumberContainer = document.getElementById('guessNumberContainer'); // Container Game 1
const rpsContainer = document.getElementById('rpsContainer'); // Container Game 2

// Elemen RPS
const rpsResultDisplay = document.getElementById('rpsResult');
const rpsPlayerScoreDisplay = document.getElementById('rpsPlayerScore');
const rpsComputerScoreDisplay = document.getElementById('rpsComputerScore');
const rpsButtons = document.querySelectorAll('.rps-btn');
const rpsResetButton = document.getElementById('rpsResetButton');

// Tombol Kembali
const backToIntroButtons = document.querySelectorAll('.back-to-intro-btn');


// ------------------------------------------
// FUNGSI UTILITY (Transisi Layar)
// ------------------------------------------

function hideAllScreens() {
    introScreen.style.display = 'none';
    levelScreen.classList.remove('show-level-screen');
    levelScreen.classList.add('hidden-by-default');
    guessNumberContainer.style.display = 'none';
    rpsContainer.style.display = 'none';
}

function showIntroScreen() {
    hideAllScreens();
    introScreen.style.display = 'flex';
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
    hideAllScreens();
    rpsContainer.style.display = 'block';
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
    
    loadHighScore(); 
    
    levelScreen.classList.remove('show-level-screen');
    levelScreen.classList.add('hidden-by-default');
    guessNumberContainer.style.display = 'block';

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
    // ... (Logika checkGuess tetap sama) ...
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

// ------------------------------------------
// LOGIKA TRANSISI (Intro -> Level/Game)
// ------------------------------------------

// Fungsi Transisi dari Intro ke Layar Level (Tebak Angka)
function goToLevelSelection() {
    // 1. Sembunyikan Intro Screen
    introScreen.classList.add('hidden'); 
    
    // 2. Tunda sebentar, lalu munculkan Layar Level
    setTimeout(() => {
        introScreen.style.display = 'none'; 
        
        // Tentukan maxNumber default (misal Normal) sebelum menampilkan skor
        maxNumber = 100; 
        loadHighScore(); // Tampilkan skor default

        // Tampilkan Layar Seleksi Level
        levelScreen.classList.remove('hidden-by-default');
        levelScreen.classList.add('show-level-screen');
        
    }, 400); // Penundaan 400ms untuk efek "Memuat Game..." singkat
}

function selectLevel(event) {
    if (event.target.classList.contains('level-btn')) {
        maxNumber = parseInt(event.target.dataset.level);
        
        // Panggil fungsi utama game untuk memulai
        initializeGuessNumberGame();
    }
}


// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

// 1. Pemilihan Game di Layar Intro
startButtonGuessNumber.addEventListener('click', () => {
    // Terapkan efek loading di tombol jika perlu, atau langsung transisi
    goToLevelSelection(); 
});
startButtonRPS.addEventListener('click', initializeRPS);

// 2. Tombol Aksi Game Tebak Angka
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', resetToLevelSelection); 
levelScreen.addEventListener('click', selectLevel); 

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// 3. Tombol Aksi Game Suit Jepang
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

// 4. Tombol Kembali ke Menu Utama
backToIntroButtons.forEach(button => {
    button.addEventListener('click', showIntroScreen);
});


// Panggil fungsi inisialisasi skor default saat DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    // Atur maxNumber default untuk tampilan skor yang benar jika intro dihilangkan
    maxNumber = 100; 
    loadHighScore(); 
    // Pastikan hanya Intro yang terlihat di awal
    hideAllScreens();
    introScreen.style.display = 'flex';
});
        
