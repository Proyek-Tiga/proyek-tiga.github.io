// URL API
const apiURL = "https://tiket-backend-theta.vercel.app/api/konser-approved";

// Fungsi untuk fetch data dari API
async function fetchConcerts() {
    try {
        // Fetch data dari API
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const concerts = await response.json();

        // Dapatkan container kartu
        const cardsContainer = document.querySelector('.cards-container');

        // Kosongkan kontainer kartu
        cardsContainer.innerHTML = '';

        // Jika data kosong, tampilkan pesan
        if (concerts.length === 0) {
            cardsContainer.innerHTML = '<p>Tidak ada konser yang tersedia saat ini.</p>';
            return;
        }

        // Loop data konser dan tambahkan ke halaman
        concerts.forEach(data => {
            // Validasi dan format path gambar
            const imagePath = data.image && data.image.startsWith("http")
                ? data.image
                : `http://localhost:5000/images/${data.image || "default-image.jpg"}`; // Gunakan gambar default jika tidak ada

            // Validasi tanggal konser
            const concertDate = data.tanggal_konser
                ? new Date(data.tanggal_konser).toLocaleDateString('id-ID', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })
                : 'Tanggal tidak tersedia';

            // Ambil nama lokasi dari objek lokasi
            const lokasiName = data.lokasi.lokasi || 'Lokasi Tidak Tersedia';

            // Buat HTML kartu
            const cardHTML = `
                <div class="card">
                    <img src="${imagePath}" alt="${data.nama_konser || 'Nama Konser Tidak Tersedia'}">
                    <h3>${data.nama_konser || 'Nama Konser Tidak Tersedia'}</h3>
                    <p><i class="fas fa-tag"></i> Rp ${data.harga ? data.harga.toLocaleString('id-ID') : '0'}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${lokasiName}</p>
                    <p><i class="fas fa-calendar-alt"></i> ${concertDate}</p>
                    <p><i class="fas fa-ticket-alt"></i> ${data.jumlah_tiket || 0} Tiket</p>
                    <a href="#" class="btn-card">
                        <i class="fas fa-shopping-cart"></i> Pesan Sekarang
                    </a>
                </div>
            `;

            // Tambahkan ke container
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });

        // Tambahkan event listener untuk setiap tombol "Pesan Sekarang" setelah kartu dimuat
        const orderButtons = document.querySelectorAll('.btn-card');
        orderButtons.forEach(button => {
            button.addEventListener('click', handleOrderClick);
        });

    } catch (error) {
        console.error("Gagal memuat data konser:", error);

        // Tampilkan pesan error ke pengguna
        const cardsContainer = document.querySelector('.cards-container');
        cardsContainer.innerHTML = `<p class="error-message">Terjadi kesalahan saat memuat data konser. Silakan coba lagi nanti.</p>`;
    }
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function isLoggedIn() {
    // Gantilah sesuai cara Anda menyimpan status login (localStorage, cookie, dll)
    return localStorage.getItem('isLoggedIn') === 'true';  // Contoh menggunakan localStorage
}

// Fungsi untuk menangani klik tombol "Pesan Sekarang"
function handleOrderClick(event) {
    event.preventDefault();  // Mencegah aksi default (navigasi ke link)

    if (!isLoggedIn()) {
        // Tampilkan pesan login
        alert("Silakan login terlebih dahulu untuk melakukan pemesanan.");
        // Arahkan pengguna ke halaman login jika perlu
        window.location.href = "https://proyek-tiga.github.io/login";  // Ubah URL sesuai dengan halaman login Anda
    } else {
        // Lanjutkan ke proses pemesanan jika sudah login
        alert("Lanjutkan dengan pemesanan!");
        // Proses pemesanan bisa dimasukkan di sini
    }
}

// Panggil fungsi fetchConcerts saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchConcerts);
