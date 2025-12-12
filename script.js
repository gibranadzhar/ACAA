document.addEventListener('DOMContentLoaded', () => {
    // Ambil semua elemen dengan kelas 'page'
    const pages = document.querySelectorAll('.page');
    // Index halaman yang akan dibalik berikutnya (dimulai dari sampul)
    let currentPageIndex = 0; 

    function flipPage() {
        // Ambil halaman saat ini
        const pageToFlip = pages[currentPageIndex];
        
        if (pageToFlip) {
            // Tambahkan kelas 'flipped' untuk memulai animasi putar CSS
            pageToFlip.classList.add('flipped');
            
            // Pindah ke set halaman berikutnya (melompati dua halaman sekaligus, karena satu lembar = 2 halaman)
            currentPageIndex += 2;
        } else {
            alert("Terima kasih sudah melihat semua kenangan!");
            // Opsional: Muat ulang atau pindah ke halaman akhir
        }
    }

    // Pasang event listener 'click' ke setiap halaman
    pages.forEach(page => {
        page.addEventListener('click', flipPage);
    });
});
