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

// Panggil fungsi fetchConcertDetail saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchConcertDetail();
    fetchTickets(); // Tambahkan ini agar tiket ikut dimuat

    // Ambil elemen tombol "Order Now"
    const orderButton = document.getElementById('order-now');
    orderButton.addEventListener('click', () => {
        // Ambil ID konser dari URL
        const concertId = new URLSearchParams(window.location.search).get('id');

        // Jika ID konser ada, arahkan ke halaman payment.html dengan ID tersebut
        if (concertId) {
            const paymentUrl = `https://proyek-tiga.github.io/payment.html?id=${concertId}`;
            window.location.href = paymentUrl;  // Arahkan ke halaman pembayaran
        } else {
            alert('ID konser tidak ditemukan!');
        }
    });
});

// Fungsi untuk fetch data tiket
async function fetchTickets() {
    try {
        const response = await fetch(apiTiketURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        let tickets = await response.json();
        if (!Array.isArray(tickets)) tickets = [tickets];

        const ticketListContainer = document.querySelector('.ticket-list');
        const orderSummaryContainer = document.querySelector('.order-summary');
        let cart = {}; 
        
        ticketListContainer.innerHTML = tickets.map(ticket => {
            cart[ticket.id] = 0; 
            return `
                <div class="ticket-card" data-id="${ticket.id}">
                    <h4>${ticket.nama_tiket}</h4>
                    <p><strong>Harga:</strong> Rp ${ticket.harga.toLocaleString('id-ID')}</p>
                    <p><strong>Jumlah Tiket:</strong> ${ticket.jumlah_tiket} Tiket</p>
                    <div class="quantity-control">
                        <button class="decrease" data-id="${ticket.id}">-</button>
                        <span class="quantity" id="quantity-${ticket.id}">0</span>
                        <button class="increase" data-id="${ticket.id}">+</button>
                    </div>
                </div>
            `;
        }).join('');
        
        ticketListContainer.addEventListener("click", event => {
            const target = event.target;
            if (!target.classList.contains("increase") && !target.classList.contains("decrease")) return;
            
            const ticketId = target.getAttribute("data-id");
            const ticket = tickets.find(t => t.id == ticketId);
            
            if (target.classList.contains("increase") && cart[ticketId] < ticket.jumlah_tiket) {
                cart[ticketId]++;
            } else if (target.classList.contains("decrease") && cart[ticketId] > 0) {
                cart[ticketId]--;
            }
            document.getElementById(`quantity-${ticketId}`).textContent = cart[ticketId];
            updateOrderSummary(cart, tickets);
        });
        
        updateOrderSummary(cart, tickets, orderSummaryContainer);
    } catch (error) {
        console.error("Gagal memuat data tiket:", error);
        document.querySelector('.ticket-list').innerHTML = `<p class="error-message">Terjadi kesalahan saat memuat tiket. Silakan coba lagi nanti.</p>`;
    }
}

function updateOrderSummary(cart, tickets) {
    let total = 0;
    let summaryHTML = '<h3>Pesanan:</h3><ul>';
    
    Object.keys(cart).forEach(ticketId => {
        if (cart[ticketId] > 0) {
            const ticket = tickets.find(t => t.id == ticketId);
            const subtotal = ticket.harga * cart[ticketId];
            total += subtotal;
            summaryHTML += `
                <li>
                    ${ticket.nama_tiket} - ${cart[ticketId]} x Rp ${ticket.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}
                </li>
            `;
        }
    });
    
    summaryHTML += `</ul><h3>Total Pesanan: Rp ${total.toLocaleString('id-ID')}</h3>`;
    summaryHTML += '<button id="order-now">Order Now</button>';

    // Perbarui tampilan ringkasan pesanan
    document.querySelector('.order-summary').innerHTML = summaryHTML;

    // Perbarui total harga
    document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;
}



