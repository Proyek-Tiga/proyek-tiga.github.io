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

        localStorage.setItem("concertDetails", JSON.stringify(concert));

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
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        let tickets = await response.json();
        console.log("Data tiket yang diterima:", tickets); // Log untuk debug
        if (!Array.isArray(tickets)) tickets = [tickets];

        const ticketListContainer = document.querySelector('.ticket-list');
        const orderSummaryContainer = document.querySelector('.order-summary');
        let cart = {};

        ticketListContainer.innerHTML = tickets.map(ticket => {
            cart[ticket.tiket_id] = 0;
            return `
                <div class="ticket-card" data-id="${ticket.tiket_id}">
                    <h4>${ticket.nama_tiket}</h4>
                    <p><strong>Harga:</strong> Rp ${ticket.harga.toLocaleString('id-ID')}</p>
                    <p><strong>Jumlah Tiket:</strong> ${ticket.jumlah_tiket} Tiket</p>
                    <div class="quantity-control">
                        <button class="decrease" data-id="${ticket.tiket_id}">-</button>
                        <span class="quantity" id="quantity-${ticket.tiket_id}">0</span>
                        <button class="increase" data-id="${ticket.tiket_id}">+</button>
                    </div>
                </div>
            `;
        }).join('');

        ticketListContainer.addEventListener("click", event => {
            const target = event.target;
            if (!target.classList.contains("increase") && !target.classList.contains("decrease")) return;

            const ticketId = target.getAttribute("data-id");
            const ticket = tickets.find(t => t.tiket_id == ticketId);

            // Cek apakah tiket ditemukan
            if (!ticket) {
                console.error(`Tiket dengan ID ${ticketId} tidak ditemukan!`);
                return;
            }

            if (target.classList.contains("increase") && cart[ticketId] < ticket.jumlah_tiket) {
                cart[ticketId]++;
            } else if (target.classList.contains("decrease") && cart[ticketId] > 0) {
                cart[ticketId]--;
            }
            document.getElementById(`quantity-${ticketId}`).textContent = cart[ticketId];
            updateOrderSummary(cart, tickets, orderSummaryContainer);
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
            const ticket = tickets.find(t => t.tiket_id == ticketId);
            const subtotal = ticket.harga * cart[ticketId];
            total += subtotal;
            summaryHTML += `
                <li>
                    ${ticket.nama_tiket} - ${cart[ticketId]} x Rp ${ticket.harga.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}
                </li>
            `;
        }
    });

    summaryHTML += `</ul><h3>Total: Rp ${total.toLocaleString('id-ID')}</h3>`;
    summaryHTML += '<button id="order-now">Order Now</button>';

    const orderSummaryElement = document.querySelector('.order-summary');
    if (!orderSummaryElement) {
        console.error("Elemen .order-summary tidak ditemukan!");
        return;
    }

    orderSummaryElement.innerHTML = summaryHTML;
}

// Panggil fungsi fetchConcertDetail dan fetchTickets saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    fetchConcertDetail();
    fetchTickets();
});

document.addEventListener("click", async function (event) {
    if (event.target.id === "order-now") {
        const token = localStorage.getItem("authToken");
        if (!token) {
            alert("Anda harus login terlebih dahulu!");
            return;
        }

        // Decode token untuk mendapatkan user_id
        const user = JSON.parse(atob(token.split(".")[1])); // Dekode payload JWT
        const user_id = user.user_id;
        console.log("User ID:", user_id); // Debugging

        // Ambil elemen tiket yang dipesan
        let cart = {};
        document.querySelectorAll(".quantity-control .quantity").forEach(el => {
            const ticketId = el.id.replace("quantity-", "");
            const quantity = parseInt(el.textContent);
            if (quantity > 0) {
                cart[ticketId] = quantity;
            }
        });

        // Ambil detail tiket dari API yang sebelumnya sudah di-load
        try {
            const response = await fetch(apiTiketURL);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            let tickets = await response.json();
            if (!Array.isArray(tickets)) tickets = [tickets];

            // Buat array berisi tiket yang dipesan
            const orderDetails = Object.keys(cart).map(ticketId => {
                const ticket = tickets.find(t => t.tiket_id == ticketId);
                return {
                    tiket_id: ticket.tiket_id,
                    nama_tiket: ticket.nama_tiket,
                    harga: ticket.harga,
                    qty: cart[ticketId],
                    subtotal: ticket.harga * cart[ticketId]
                };
            });

            // Hitung total harga
            const totalHarga = orderDetails.reduce((sum, item) => sum + item.subtotal, 0);
            if (orderDetails.length === 0) {
                alert("Pilih setidaknya satu tiket sebelum melakukan pemesanan.");
                return;
            }

            // Data yang akan dikirim ke backend
            const transaksiData = {
                user_id: user_id,
                tiket_id: orderDetails[0].tiket_id, // Ambil tiket pertama (asumsi hanya satu transaksi)
                qty: orderDetails[0].qty,
                harga: totalHarga,
                keterangan: "Berhasil"
            };

            console.log("Data Transaksi:", transaksiData); // Debugging

            // Kirim POST request ke API transaksi
            const transaksiResponse = await fetch("https://tiket-backend-theta.vercel.app/api/transaksi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Kirim token untuk autentikasi
                },
                body: JSON.stringify(transaksiData)
            });

            if (!transaksiResponse.ok) {
                throw new Error(`Gagal membuat transaksi! Status: ${transaksiResponse.status}`);
            }

            const transaksiResult = await transaksiResponse.json();
            console.log("Respon API:", transaksiResult); // Debugging

            // Simpan data transaksi ke localStorage untuk halaman pembayaran
            localStorage.setItem("orderDetails", JSON.stringify(orderDetails));

            // Redirect ke halaman pembayaran
            window.location.href = "payment.html";

        } catch (error) {
            console.error("Error saat memproses transaksi:", error);
            alert("Terjadi kesalahan saat melakukan transaksi. Silakan coba lagi.");
        }
    }
});






