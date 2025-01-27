const token = localStorage.getItem("authToken");

if (!token) {
    alert("Token tidak ditemukan. Harap login terlebih dahulu.");
    window.location.href = "proyek-tiga.github.io/login"; // Ganti dengan halaman login
}

// Fungsi untuk mendapatkan user_id dari token
function getUserIdFromToken() {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Dekode token JWT
        console.log("User ID dari token:", payload.user_id); // Debugging
        return payload.user_id;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

// Fungsi untuk mengambil tiket dari API
async function fetchUserTickets() {
    const userId = getUserIdFromToken();
    if (!userId) {
        console.error("User ID tidak ditemukan dalam token");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/e-ticket", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data tiket. Status: ${response.status}`);
        }

        const tickets = await response.json();
        console.log("Data tiket dari API:", tickets); // Debugging

        if (!Array.isArray(tickets)) {
            console.error("Data API bukan array:", tickets);
            return;
        }

        // Filter tiket berdasarkan user_id
        const userTickets = tickets.filter(ticket => String(ticket.user_id) === String(userId));
        console.log("Tiket sesuai user:", userTickets); // Debugging

        // Menampilkan tiket ke dalam tabel
        const tbody = document.querySelector(".ticket-table tbody");
        tbody.innerHTML = ""; // Kosongkan sebelum diisi ulang

        userTickets.forEach((ticket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${ticket.tiket_name}</td>
                <td>${ticket.konser_name}</td>
                <td>${new Date(ticket.tanggal_konser).toLocaleDateString()}</td>
                <td>${ticket.konser_location}</td>
                <td><img src="${ticket.qr_code}" alt="QR Code" width="50"></td>
                <td>${ticket.transaksi_status}</td>
                <td><button class="btn-detail" onclick="showTicketDetail(${index})">Detail</button></td>
            `;
            tbody.appendChild(row);
        });

        console.log("Tiket berhasil ditampilkan di UI");
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Fungsi untuk menampilkan detail tiket (nanti bisa dikembangkan lebih lanjut)
function showTicketDetail(index) {
    alert(`Menampilkan detail untuk tiket ke-${index + 1}`);
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchUserTickets);
