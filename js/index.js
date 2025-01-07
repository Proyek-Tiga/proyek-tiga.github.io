let currentIndex = 0;  // Menyimpan index slide saat ini
const slides = document.querySelectorAll('.slide');  // Mengambil semua elemen dengan kelas .slide
const totalSlides = slides.length;  // Menyimpan jumlah total slide

// Fungsi untuk menampilkan slide berdasarkan index
function showSlide(index) {
    // Geser semua gambar sesuai dengan index yang aktif
    slides.forEach((slide, i) => {
        slide.style.transition = 'transform 0.5s ease-in-out';  // Pastikan transisi berjalan halus
        slide.style.transform = `translateX(${(i - index) * 100}%)`;  // Geser gambar berdasarkan perbedaan index
    });
}

// Fungsi untuk berpindah ke slide berikutnya atau sebelumnya
function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;  // Menambahkan arah dan memastikan looping
    showSlide(currentIndex);  // Tampilkan slide berdasarkan index yang baru
}

// Mulai auto-slide setiap 3 detik
setInterval(() => {
    moveSlide(1);  // Pindah ke slide berikutnya
}, 3000);  // Ganti slide setiap 3 detik

// Menampilkan slide pertama saat halaman dimuat
showSlide(currentIndex);
