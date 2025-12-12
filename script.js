// ... (Bagian awal script.js tetap sama)

// Fungsi untuk memproses tebakan pemain
function checkGuess() {
    const guess = parseInt(guessInput.value);

    // ... (Validasi dan penambahan attempts tetap sama)
    
    // Pastikan kita masih menebak
    if (guess !== secretNumber) {
        attempts++;
        attemptsDisplay.textContent = attempts;
    }
    
    // ... (Logika menang/kalah dan Terlalu Rendah/Tinggi tetap sama)

    if (guess === secretNumber) {
        // KONDISI BENAR (Tetap sama)
        resultDisplay.textContent = `🎉 Selamat! Anda benar dalam ${attempts} tebakan!`;
        resultDisplay.style.color = '#4CAF50';
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

    // --- LOGIKA CLUE BARU DIMULAI DI SINI ---
    
    if (attempts >= 5 && guess !== secretNumber) {
        let clue = "";
        
        // Clue 1: Apakah angka ganjil atau genap? (Setelah 5 tebakan)
        if (attempts === 5) {
            clue = (secretNumber % 2 === 0) ? 
                   "Petunjuk: Angka misteri itu adalah **Genap**." : 
                   "Petunjuk: Angka misteri itu adalah **Ganjil**.";
        } 
        
        // Clue 2: Apakah angka di setengah pertama atau kedua (Setelah 8 tebakan)
        else if (attempts === 8) {
            clue = (secretNumber <= 50) ? 
                   "Petunjuk: Angka itu berada di **paruh pertama** (1-50)." :
                   "Petunjuk: Angka itu berada di **paruh kedua** (51-100).";
        }
        
        // Clue 3: Apakah angka kelipatan dari 5 atau 10? (Setelah 12 tebakan)
        else if (attempts === 12) {
             if (secretNumber % 10 === 0) {
                clue = "Petunjuk: Angka misteri itu **Kelipatan 10**.";
             } else if (secretNumber % 5 === 0) {
                clue = "Petunjuk: Angka misteri itu **Kelipatan 5**.";
             } else {
                clue = "Petunjuk: Angka misteri itu **bukan kelipatan 5 atau 10**.";
             }
        }
        
        // Gabungkan petunjuk baru dengan feedback tebakan
        if (clue) {
            resultDisplay.innerHTML += `<br><span style="color: purple; font-size: 0.9em;">${clue}</span>`;
        }
    }

    // --- LOGIKA CLUE BARU SELESAI DI SINI ---
    
    // Bersihkan input dan fokus untuk tebakan berikutnya (Tetap sama)
    guessInput.value = '';
    guessInput.focus();
}

// ... (Bagian event listeners dan initializeGame tetap sama)
