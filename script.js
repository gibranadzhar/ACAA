// script.js

// Variabel Global
let secretNumber;
let attempts;
let maxNumber;
const gameKey = "guessNumberHighScore"; 

// Mendapatkan elemen DOM
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');
const introScreen = document.querySelector('.intro-screen');
const startButton = document.getElementById('startButton');
const levelScreen = document.querySelector('.level-selection-screen'); 
const levelButtons = document.querySelectorAll('.level-btn'); 

// ------------------------------------------
// LOGIKA HIGH SCORE
// ------------------------------------------

function loadHighScore() {
    const score = localStorage.getItem(gameKey);
    if (score && score !== 'null') {
        highScoreDisplay.textContent = `Skor Terbaik (Tebakan Terendah): ${score} tebakan.`;
    } else {
        highScoreDisplay.textContent = "Skor Terbaik: Belum ada";
    }
}

function updateHighScore() {
    let oldScore = parseInt(localStorage.getItem(gameKey));

    if (isNaN(oldScore) || attempts < oldScore) {
        localStorage.setItem(gameKey, attempts);
        loadHighScore();
        return true; 
    }
    return false; 
}

// ------------------------------------------
// LOGIKA UTAMA GAME
// ------------------------------------------

function initializeGame() {
    maxNumber = parseInt(maxNumber); // Pastikan maxNumber adalah integer
    
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    
    levelScreen.classList.remove('show-level-screen');
    levelScreen.classList.add('hidden-by-default');
    
    document.querySelector('.container').style.display = 'block';

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

    // Validasi input
    if (isNaN(guess) || guess < 1 || guess > maxNumber) {
        resultDisplay.textContent = `Masukkan angka yang valid (1-${maxNumber})!`;
        resultDisplay.style.color = '#ff9800'; 
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    // Hitung selisih absolut untuk logika Panas/Dingin
    const difference = Math.abs(guess - secretNumber);
    let feedbackText = "";
    
    if (difference === 0) {
        // KONDISI MENANG
        feedbackText = `🎉 SELAMAT! Anda benar dalam ${attempts} tebakan! Angka misteri itu adalah ${secretNumber}.`;
        resultDisplay.style.color = '#4CAF50';
        
        const isNewRecord = updateHighScore();
        if (isNewRecord) {
            // PERBAIKAN TANDA ** (bintang ganda)
            feedbackText += '<br><b>🔥 REKOR BARU TERCIPTA!</b>'; 
        }

        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        
    } else {
        // Logika Panas/Dingin
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

        // Gabungkan dengan feedback Tinggi/Rendah
        if (guess < secretNumber) {
            feedbackText += "Terlalu rendah! Coba lagi.";
        } else {
            feedbackText += "Terlalu tinggi! Coba lagi.";
        }

        resultDisplay.style.color = hotOrColdClass;

        // CLUE TAMBAHAN (GANJIL/GENAP)
        if (attempts === 5 && maxNumber <= 100) { 
            let specificClue = (secretNumber % 2 === 0) ? 
                               // PERBAIKAN TANDA ** (bintang ganda)
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
// LOGIKA INTRO DAN LEVEL SELECTION
// ------------------------------------------

// Fungsi Baru: Menangani pilihan level
function selectLevel(event) {
    if (event.target.classList.contains('level-btn')) {
        maxNumber = parseInt(event.target.dataset.level);
        
        levelScreen.classList.remove('show-level-screen');
        levelScreen.classList.add('hidden-by-default');
        
        // Panggil fungsi utama game untuk memulai dengan maxNumber yang baru
        initializeGame();
    }
}

// Fungsi Transisi dari Intro ke Layar Level
function startGame() {
    startButton.textContent = "🚀 Memuat Game...";
    startButton.disabled = true; 
    startButton.style.backgroundColor = '#4a148c'; 

    setTimeout(() => {
        
        // Sembunyikan Intro Screen
        introScreen.classList.add('hidden'); 
        
        setTimeout(() => {
            introScreen.style.display = 'none'; // Sembunyikan permanen
            
            // Tampilkan Layar Seleksi Level
            levelScreen.classList.remove('hidden-by-default');
            levelScreen.classList.add('show-level-screen');
            
            // Sembunyikan container game utama sampai level dipilih
            document.querySelector('.container').style.display = 'none';

        }, 600); // Waktu yang sama dengan durasi transisi fade-out

    }, 400); // Durasi pesan loading
}

// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);
levelScreen.addEventListener('click', selectLevel); 

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// Panggil fungsi inisialisasi skor saat DOM dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
});

// Event listener untuk tombol Mulai Game
startButton.addEventListener('click', startGame);
