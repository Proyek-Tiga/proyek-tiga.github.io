const token = localStorage.getItem("authToken");
// Ambil ID konser dari URL
const urlParams = new URLSearchParams(window.location.search);
const concertId = urlParams.get('id');
console.log(concertId);  // Cek apakah ID konser terambil dengan benar

// URL API untuk mendapatkan detail konser berdasarkan ID
const apiDetailURL = `https://tiket-backend-theta.vercel.app/api/konser/${concertId}`;

// URL API untuk mendapatkan tiket berdasarkan konser ID
const apiTiketURL = `https://tiket-backend-theta.vercel.app/api/tiket/konser/${concertId}`;

// Fungsi untuk fetch data detail konser
async function fetchConcertDetail() {
    try {
        const response = await fetch(apiDetailURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const concert = await response.json();
        console.log(concert);  // Cek apakah data konser berhasil didapatkan

        // Ambil elemen untuk menampilkan detail konser
        const concertDetailsContainer = document.querySelector('.concert-details');

        // Jika data konser tidak ditemukan
        if (!concert) {
            concertDetailsContainer.innerHTML = '<p>Konser tidak ditemukan.</p>';
            return;
        }

        // Menampilkan informasi detail konser
        const concertDate = new Date(concert.tanggal_konser);
        const formattedDate = concertDate.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const formattedTime = concertDate.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        // Menampilkan informasi detail konser
        concertDetailsContainer.innerHTML = `
            <h2>Detail Konser</h2>
            <h3>${concert.nama_konser || 'Nama Konser Tidak Tersedia'}</h3>
            <div class="concert-info">
                <img src="${concert.image || 'default-image.jpg'}" alt="${concert.nama_konser || 'Nama Konser Tidak Tersedia'}">
                <div class="info">
                    <p><strong>Harga:</strong> Rp ${concert.harga ? concert.harga.toLocaleString('id-ID') : '0'}</p>
                    <p><strong>Lokasi:</strong> ${concert.lokasi_name || 'Lokasi Tidak Tersedia'}</p>
                    <p><strong>Tanggal:</strong> ${formattedDate} - ${formattedTime} WIB</p>
                    <p><strong>Jumlah Tiket:</strong> ${concert.jumlah_tiket || 0} Tiket</p>
                    <p><strong>Nama Penyelenggara:</strong> ${concert.user_name || 'Nama Pengguna Tidak Tersedia'}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Gagal memuat data konser:", error);
        const concertDetailsContainer = document.querySelector('.concert-details');
        concertDetailsContainer.innerHTML = `<p class="error-message">Terjadi kesalahan saat memuat detail konser. Silakan coba lagi nanti.</p>`;
    }
}

// Fungsi untuk fetch data tiket
async function fetchTickets() {
    try {
        const response = await fetch(apiTiketURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const tickets = await response.json();
        console.log("Data tiket yang diterima:", tickets); 

        const ticketListContainer = document.querySelector('.ticket-list');
        if (!ticketListContainer) {
            console.error("Elemen .ticket-list tidak ditemukan di halaman.");
            return;
        }

        // Periksa apakah tickets adalah array
        if (!Array.isArray(tickets)) {
            console.warn("Data tiket bukan array, mengonversi ke array.");
            tickets = [tickets]; // Ubah menjadi array jika bukan array
        }

        if (tickets.length === 0) {
            ticketListContainer.innerHTML = '<p>Tidak ada tiket tersedia untuk konser ini.</p>';
            return;
        }

        ticketListContainer.innerHTML = tickets.map(ticket => `
            <div class="ticket-card">
                <h4>${ticket.nama_tiket}</h4>
                <p><strong>Harga:</strong> Rp ${ticket.harga.toLocaleString('id-ID')}</p>
                <p><strong>Jumlah Tiket:</strong> ${ticket.jumlah_tiket} Tiket</p>
                <button class="buy-button">Beli Tiket</button>
            </div>
        `).join('');
    } catch (error) {
        console.error("Gagal memuat data tiket:", error);
        document.querySelector('.ticket-list').innerHTML = `<p class="error-message">Terjadi kesalahan saat memuat tiket. Silakan coba lagi nanti.</p>`;
    }
}

// Panggil fungsi fetchConcertDetail saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchConcertDetail();
    fetchTickets(); // Tambahkan ini agar tiket ikut dimuat
});

