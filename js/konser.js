// URL API
const apiURL = "http://localhost:5000/api/konser-approved";

// Fungsi untuk fetch data dari API
async function fetchConcerts() {
    try {
        const response = await fetch(apiURL);
        const concerts = await response.json();

        // Dapatkan container kartu
        const cardsContainer = document.querySelector('.cards-container');

        // Kosongkan kontainer kartu
        cardsContainer.innerHTML = '';

        // Loop data konser dan tambahkan ke halaman
        concerts.forEach(concert => {
            // Periksa apakah gambar memiliki path lengkap, jika tidak, tambahkan prefix path.
            const imagePath = concert.image.startsWith("http") ? concert.image : `http://localhost:5000/images/${concert.image}`;

            const cardHTML = `
                <div class="card">
                    <img src="${imagePath}" alt="${concert.nama_konser}">
                    <h3>${concert.nama_konser}</h3>
                    <p><i class="fas fa-tag"></i> Rp ${concert.harga.toLocaleString()}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${concert.lokasi_id}</p>
                    <p><i class="fas fa-calendar-alt"></i> ${new Date(concert.tanggal_konser).toLocaleDateString('id-ID', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}</p>
                    <p><i class="fas fa-ticket-alt"></i> ${concert.jumlah_tiket} Tiket</p>
                    <a href="#" class="btn-card">
                        <i class="fas fa-shopping-cart"></i> Pesan Sekarang
                    </a>
                </div>
            `;
            // Tambahkan ke container
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    } catch (error) {
        console.error("Gagal memuat data konser:", error);
    }
}

// Panggil fungsi fetchConcerts saat halaman dimuat
document.addEventListener('DOMContentLoaded', fetchConcerts);
