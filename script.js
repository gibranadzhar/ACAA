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
const difficultySelect = document.getElementById('difficulty');
const highScoreDisplay = document.getElementById('highScoreDisplay');
const instructionText = document.querySelector('.instruction');


// ------------------------------------------
// LOGIKA HIGH SCORE (SKOR TERTINGGI)
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
    maxNumber = parseInt(difficultySelect.value);
    
    secretNumber = Math.floor(Math.random() * maxNumber) + 1;
    attempts = 0;
    
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
    difficultySelect.disabled = true;

    // Hitung selisih absolut untuk logika Panas/Dingin
    const difference = Math.abs(guess - secretNumber);
    let feedbackText = "";
    
    if (difference === 0) {
        // KONDISI MENANG
        feedbackText = `🎉 SELAMAT! Anda benar dalam ${attempts} tebakan! Angka misteri itu adalah ${secretNumber}.`;
        resultDisplay.style.color = '#4CAF50';
        
        const isNewRecord = updateHighScore();
        if (isNewRecord) {
            feedbackText += '<br>🔥 **REKOR BARU TERCIPTA!**';
        }

        guessInput.disabled = true;
        guessButton.style.display = 'none';
        resetButton.style.display = 'inline-block';
        
    } else {
        // Logika Panas/Dingin berdasarkan jarak
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

        // --- CLUE TAMBAHAN (GANJIL/GENAP) ---
        // Clue Ganjil/Genap hanya muncul jika attempts >= 5 dan rentang Normal/Mudah
        if (attempts === 5 && maxNumber <= 100) { 
            let specificClue = (secretNumber % 2 === 0) ? 
                               "💡 Petunjuk: Angka misteri itu adalah **Genap**." : 
                               "💡 Petunjuk: Angka misteri itu adalah **Ganjil**.";
             feedbackText += `<br><span style="color: purple; font-size: 0.9em;">${specificClue}</span>`;
        }
    }
    
    resultDisplay.innerHTML = feedbackText;
    
    guessInput.value = '';
    guessInput.focus();
}

// ------------------------------------------
// EVENT LISTENERS
// ------------------------------------------

guessButton.addEventListener('click', checkGuess);
resetButton.addEventListener('click', initializeGame);
difficultySelect.addEventListener('change', initializeGame); 

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
