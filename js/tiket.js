const token = localStorage.getItem("authToken");

if (!token) {
    alert("Token tidak ditemukan. Harap login terlebih dahulu.");
    window.location.href = "proyek-tiga.github.io/login";
}

let tickets = [];  // Menyimpan data tiket di luar fungsi

// Fungsi untuk mendapatkan user_id dari token
function getUserIdFromToken() {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        console.log("Payload token:", payload); // Debugging: tampilkan seluruh payload

        if (!payload.user_id) {
            console.error("User ID tidak ditemukan dalam token");
            return null;
        }

        console.log("User ID dari token:", payload.user_id);
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
        // Ganti URL menjadi yang sesuai, tidak perlu menggunakan userId dalam URL
        const response = await fetch("http://localhost:5000/api/e-ticket", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Kirim token dengan format yang benar
            }
        });

        if (!response.ok) {
            throw new Error(`Gagal mengambil data tiket. Status: ${response.status}`);
        }

        tickets = await response.json();  // Menyimpan data tiket ke variabel global
        console.log("Data tiket dari API:", tickets); // Debugging

        if (!Array.isArray(tickets)) {
            console.error("Data API bukan array:", tickets);
            return;
        }

        const tbody = document.querySelector(".ticket-table tbody");
        if (!tbody) {
            console.error("Elemen tbody tidak ditemukan!");
            return;
        }

        tbody.innerHTML = ""; // Kosongkan sebelum diisi ulang

        tickets.forEach((ticket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${ticket.tiket_name}</td>
                <td>${ticket.konser_name}</td>
                <td>${new Date(ticket.tanggal_konser).toLocaleDateString()}</td>
                <td>${ticket.konser_location}</td>
                <td>
                    ${ticket.qr_code
                    ? `<img src="${ticket.qr_code}" alt="QR Code" width="50">`
                    : "Tidak tersedia"}
                </td>
                <td>${ticket.transaksi_status}</td>
                <td>
                    <button class="btn-detail" onclick="showTicketDetail(${index})">
                        <i class="fa-solid fa-circle-info"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        console.log("Tiket berhasil ditampilkan di UI");
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Fungsi untuk menampilkan detail tiket dalam modal
function showTicketDetail(index) {
    const ticket = tickets[index]; // Sekarang kita bisa mengakses 'tickets' karena sudah disimpan secara global

    // Isi modal dengan data tiket
    document.getElementById("ticket-name").innerText = ticket.tiket_name;
    document.getElementById("concert-name").innerText = ticket.konser_name;
    document.getElementById("concert-date").innerText = new Date(ticket.tanggal_konser).toLocaleDateString();
    document.getElementById("location").innerText = ticket.konser_location;
    document.getElementById("status").innerText = ticket.transaksi_status;
    
    // QR Code (jika ada)
    if (ticket.qr_code) {
        document.getElementById("qr-code").src = ticket.qr_code;
        document.getElementById("qr-code-container").style.display = "block";
    } else {
        document.getElementById("qr-code-container").style.display = "none";
    }

    // Tampilkan modal
    document.getElementById("ticket-modal").style.display = "flex";
}

// Fungsi untuk menutup modal
function closeTicketModal() {
    document.getElementById("ticket-modal").style.display = "none";
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchUserTickets);
