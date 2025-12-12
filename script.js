// script.js (KODE BARU LENGKAP)

// Variabel Global
let secretNumber;
let attempts;
let maxNumber; // Batas angka saat ini (50, 100, atau 1000)
const baseGameKey = "guessNumberHighScore"; // Kunci dasar untuk localStorage

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
// LOGIKA HIGH SCORE (Diperbarui untuk Level)
// ------------------------------------------

function getHighScoreKey() {
    // Menghasilkan kunci unik berdasarkan level saat ini (maxNumber)
    return `${baseGameKey}_${maxNumber}`;
}

function loadHighScore() {
    // Ambil skor untuk level saat ini
    const currentKey = getHighScoreKey();
    const score = localStorage.getItem(currentKey);
    let levelName = "";
    
    if (maxNumber === 50) levelName = "Mudah";
    else if (maxNumber === 100) levelName = "Normal";
    else if (maxNumber === 1000) levelName = "Sulit";

    if (score && score !== 'null') {
        highScoreDisplay.innerHTML = `Skor Terbaik Level <b>${levelName}</b>: ${score} tebakan.`;
    } else {
        highScoreDisplay.innerHTML = `Skor Terbaik Level <b>${levelName}</b>: Belum ada`;
    }
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

// ------------------------------------------
// LOGIKA UTAMA GAME
// ------------------------------------------

function initializeGame() {
    maxNumber = parseInt(maxNumber); 
    
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    
    // Panggil loadHighScore agar tampilan skor terbaik sesuai level yang baru
    loadHighScore(); 
    
    // Transisi tampilan
    levelScreen.classList.remove('show-level-screen');
    levelScreen.classList.add('hidden-by-default');
    document.querySelector('.container').style.display = 'block';

    // Reset dan atur tampilan
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
            feedbackText += '<br><b>🔥 REKOR BARU TERCIPTA!</b>'; 
        }

        // Tampilan akhir
        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block'; // Tombol Main Lagi Muncul
        
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

// FUNGSI BARU: Kembali ke Layar Seleksi Level setelah menang
function resetToLevelSelection() {
    // Reset tampilan attempts
    attemptsDisplay.textContent = 0;
    
    // Sembunyikan container game utama
    document.querySelector('.container').style.display = 'none';
    
    // Tampilkan Layar Seleksi Level
    levelScreen.classList.remove('hidden-by-default');
    levelScreen.classList.add('show-level-screen');

    // Sembunyikan tombol reset
    resetButton.style.display = 'none';
}


// Fungsi untuk memilih level
function selectLevel(event) {
    if (event.target.classList.contains('level-btn')) {
        maxNumber = parseInt(event.target.dataset.level);
        
        // Panggil inisialisasi game dengan maxNumber yang baru
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
            
            // Tentukan maxNumber default (misal Normal) sebelum menampilkan skor
            maxNumber = 100; 
            
            // Panggil loadHighScore() di sini untuk menampilkan skor default (Normal)
            loadHighScore(); 

            // Tampilkan Layar Seleksi Level
            levelScreen.classList.remove('hidden-by-default');
            levelScreen.classList.add('show-level-screen');
            
            // Sembunyikan container game utama sampai level dipilih
            document.querySelector('.container').style.display = 'none';

        }, 600); 

    }, 400); 
}

// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

guessButton.addEventListener('click', checkGuess);
// Tombol Reset sekarang mengarah ke pemilihan level
resetButton.addEventListener('click', resetToLevelSelection); 
levelScreen.addEventListener('click', selectLevel); 

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// Panggil fungsi inisialisasi skor default (untuk kasus refresh halaman)
document.addEventListener('DOMContentLoaded', () => {
    // Atur maxNumber default untuk tampilan skor di halaman awal jika tidak ada intro
    maxNumber = 100; 
    loadHighScore(); 
});

// Event listener untuk tombol Mulai Game
startButton.addEventListener('click', startGame);
