const token = localStorage.getItem("authToken");

if (!token) {
    alert("Token tidak ditemukan. Harap login terlebih dahulu.");
    window.location.href = "/login.html"; // Sesuaikan dengan halaman login
}

// Fungsi untuk mendapatkan user_name dan validasi token JWT
function getUserNameFromToken() {
    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        console.log("User Name dari token:", payload.user_name); // Debugging

        // Periksa apakah token sudah kadaluarsa
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
            alert("Sesi telah berakhir. Silakan login kembali.");
            localStorage.removeItem("authToken");
            window.location.href = "/login.html";
            return null;
        }

        return payload.user_name;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

// Fungsi untuk mengambil tiket dari API
async function fetchUserTickets() {
    const userName = getUserNameFromToken();
    if (!userName) {
        console.error("User Name tidak ditemukan dalam token");
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
            if (response.status === 401) {
                alert("Sesi Anda telah habis. Silakan login kembali.");
                localStorage.removeItem("authToken");
                window.location.href = "/login.html";
            } else {
                throw new Error(`Gagal mengambil data tiket. Status: ${response.status}`);
            }
        }

        const tickets = await response.json();
        console.log("Data tiket dari API:", tickets); // Debugging

        if (!Array.isArray(tickets)) {
            console.error("Data API bukan array:", tickets);
            return;
        }

        // Filter tiket berdasarkan user_name
        const userTickets = tickets.filter(ticket => ticket.user_name === userName);
        console.log("Tiket sesuai user:", userTickets); // Debugging

        const tbody = document.querySelector(".ticket-table tbody");
        if (!tbody) {
            console.error("Elemen tbody tidak ditemukan!");
            return;
        }

        tbody.innerHTML = ""; // Kosongkan sebelum diisi ulang

        if (userTickets.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Tidak ada tiket ditemukan.</td></tr>`;
            return;
        }

        userTickets.forEach((ticket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${ticket.tiket_name || "Tidak tersedia"}</td>
                <td>${ticket.konser_name || "Tidak tersedia"}</td>
                <td>${ticket.tanggal_konser ? new Date(ticket.tanggal_konser).toLocaleDateString() : "Tidak tersedia"}</td>
                <td>${ticket.konser_location || "Tidak tersedia"}</td>
                <td>
                    ${ticket.qr_code 
                        ? `<img src="${ticket.qr_code}" alt="QR Code" width="50">`
                        : "Tidak tersedia"}
                </td>
                <td>${ticket.transaksi_status || "Tidak tersedia"}</td>
                <td><button class="btn-detail" onclick="showTicketDetail(${index})">Detail</button></td>
            `;
            tbody.appendChild(row);
        });

        console.log("Tiket berhasil ditampilkan di UI");
    } catch (error) {
        console.error("Error fetching tickets:", error);
    }
}

// Fungsi untuk menampilkan detail tiket
function showTicketDetail(index) {
    alert(`Menampilkan detail untuk tiket ke-${index + 1}`);
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", fetchUserTickets);
