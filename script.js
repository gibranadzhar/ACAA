// script.js

// Variabel global
let secretNumber;
let attempts;
const guessInput = document.getElementById('guessInput');
const guessButton = document.getElementById('guessButton');
const resetButton = document.getElementById('resetButton');
const resultDisplay = document.getElementById('result');
const attemptsDisplay = document.getElementById('attempts');

// Fungsi untuk memulai/mengatur ulang permainan
function initializeGame() {
    // Pilih angka acak antara 1 dan 100
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    
    // Atur ulang tampilan
    resultDisplay.textContent = "Mulai menebak!";
    resultDisplay.style.color = '#333';
    attemptsDisplay.textContent = attempts;
    guessInput.value = '';
    guessInput.disabled = false;
    guessButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
    guessInput.focus(); // Fokuskan kursor ke input
}

// Fungsi untuk memproses tebakan pemain
function checkGuess() {
    const guess = parseInt(guessInput.value);

    // Validasi input
    if (isNaN(guess) || guess < 1 || guess > 100) {
        resultDisplay.textContent = "Masukkan angka yang valid (1-100)!";
        resultDisplay.style.color = '#ff9800'; // Warna peringatan
        return;
    }

    attempts++;
    attemptsDisplay.textContent = attempts;

    if (guess === secretNumber) {
        // KONDISI BENAR
        resultDisplay.textContent = `🎉 Selamat! Anda benar dalam ${attempts} tebakan!`;
        resultDisplay.style.color = '#4CAF50';
        
        // Matikan input dan tampilkan tombol reset
        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        
    } else if (guess < secretNumber) {
        // KONDISI TERLALU RENDAH
        resultDisplay.textContent = "Terlalu rendah! Coba lagi.";
        resultDisplay.style.color = '#f44336';
    } else {
        // KONDISI TERLALU TINGGI
        resultDisplay.textContent = "Terlalu tinggi! Coba lagi.";
        resultDisplay.style.color = '#2196F3';
    }
    
    // Bersihkan input dan fokus untuk tebakan berikutnya
    guessInput.value = '';
    guessInput.focus();
}

// Event Listeners (Menghubungkan aksi klik dengan fungsi)
guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);

// Memungkinkan tebakan dengan menekan 'Enter'
guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !guessInput.disabled) {
        checkGuess();
    }
});

// Panggil fungsi inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', initializeGame);
