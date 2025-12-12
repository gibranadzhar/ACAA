// script.js

// Variabel Global
let secretNumber;
let attempts;
let maxNumber;
const gameKey = "guessNumberHighScore"; // Kunci untuk menyimpan skor di localStorage

// Mendapatkan elemen DOM
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');
const difficultySelect = document.getElementById('difficulty');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');


// ------------------------------------------
// LOGIKA HIGH SCORE (SKOR TERTINGGI)
// ------------------------------------------

function loadHighScore() {
    const score = localStorage.getItem(gameKey);
    // Tampilkan skor atau pesan default
    if (score && score !== 'null') {
        highScoreDisplay.textContent = `Skor Terbaik (Tebakan Terendah): ${score} tebakan.`;
    } else {
        highScoreDisplay.textContent = "Skor Terbaik: Belum ada";
    }
}

function updateHighScore() {
    // Ambil skor lama
    let oldScore = parseInt(localStorage.getItem(gameKey));

    // Jika belum ada skor atau skor baru lebih baik (lebih kecil)
    if (isNaN(oldScore) || attempts < oldScore) {
        localStorage.setItem(gameKey, attempts);
        loadHighScore();
        return true; // Skor Baru
    }
    return false; // Skor Lama tetap
}

// ------------------------------------------
// LOGIKA UTAMA GAME
// ------------------------------------------

function initializeGame() {
    // Tentukan batas angka (maxNumber) berdasarkan pilihan level
    maxNumber = parseInt(difficultySelect.value);
    
    // Pilih angka acak antara 1 dan maxNumber
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    
    // Perbarui label petunjuk dan input placeholder
    instructionText.textContent = `Saya sudah memilih angka antara 1 sampai ${maxNumber}. Coba tebak!`;
    guessInput.setAttribute('max', maxNumber);
    guessInput.placeholder = `Masukkan tebakan Anda (1-${maxNumber})`;

    // Reset tampilan
    resultDisplay.textContent = "Mulai menebak!";
    resultDisplay.style.color = '#333';
    attemptsDisplay.textContent = attempts;
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    difficultySelect.disabled = false;
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
    
    // Matikan pilihan level setelah tebakan pertama
    difficultySelect.disabled = true;

    if (guess === secretNumber) {
        // KONDISI BENAR (MENANG)
        resultDisplay.textContent = `🎉 SELAMAT! Anda benar dalam ${attempts} tebakan! Angka misteri itu adalah ${secretNumber}.`;
        resultDisplay.style.color = '#4CAF50';
        
        // Cek dan Perbarui Skor Tinggi
        const isNewRecord = updateHighScore();
        if (isNewRecord) {
            resultDisplay.innerHTML += '<br>🔥 **REKOR BARU TERCIPTA!**';
        }

        // Matikan input dan tampilkan tombol reset
        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        
    } else if (guess < secretNumber) {
        resultDisplay.textContent = "Terlalu rendah! Coba lagi.";
        resultDisplay.style.color = '#f44336';
        
    } else { // guess > secretNumber
        resultDisplay.textContent = "Terlalu tinggi! Coba lagi.";
        resultDisplay.style.color = '#2196F3';
    }
    
    // Tambahkan logika Clue tambahan di sini jika diperlukan (berdasarkan attempts)
    // ...

    guessInput.value = '';
    guessInput.focus();
}

// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame); // Mulai game baru jika level diganti

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// Panggil fungsi inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadHighScore();
    initializeGame();
});
