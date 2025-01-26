const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const concertDetails = JSON.parse(localStorage.getItem("concertDetails"));

    if (concertDetails) {
        const concertDetailContainer = document.querySelector(".concert-detail-container"); // Sesuaikan dengan elemen di payment.html

        const concertDate = new Date(concertDetails.tanggal_konser);
        const formattedDate = concertDate.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });
        const formattedTime = concertDate.toLocaleTimeString('id-ID', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        concertDetailContainer.innerHTML = `
            <h2>${concertDetails.nama_konser || 'Nama Konser Tidak Tersedia'}</h2>
            <img src="${concertDetails.image || 'default-image.jpg'}" alt="${concertDetails.nama_konser || 'Nama Konser Tidak Tersedia'}">
            <p><strong>Harga:</strong> Rp ${concertDetails.harga ? concertDetails.harga.toLocaleString('id-ID') : '0'}</p>
            <p><strong>Lokasi:</strong> ${concertDetails.lokasi_name || 'Lokasi Tidak Tersedia'}</p>
            <p><strong>Tanggal:</strong> ${formattedDate} - ${formattedTime} WIB</p>
            <p><strong>Jumlah Tiket:</strong> ${concertDetails.jumlah_tiket || 0} Tiket</p>
            <p><strong>Nama Penyelenggara:</strong> ${concertDetails.user_name || 'Nama Pengguna Tidak Tersedia'}</p>
        `;
    } else {
        console.error("Detail konser tidak ditemukan di localStorage");
    }

    const orderDetailsRaw = localStorage.getItem("orderDetails");

    if (!orderDetailsRaw) {
        console.error("Order details not found in localStorage!");
        return;
    }

    let orderDetails;

    try {
        orderDetails = JSON.parse(orderDetailsRaw);
    } catch (error) {
        console.error("Failed to parse orderDetails:", error);
        return;
    }

    console.log("Order Details from localStorage:", orderDetails);

    // Pastikan orderDetails adalah array, lalu ambil elemen pertama
    if (Array.isArray(orderDetails) && orderDetails.length > 0) {
        orderDetails = orderDetails[0]; // Ambil elemen pertama
    } else {
        console.error("Invalid orderDetails structure!");
        return;
    }

    // Tampilkan data konser
    document.getElementById("concert-name").textContent = orderDetails.nama_tiket ?? "Data tidak tersedia";
    document.getElementById("concert-location").textContent = "Lokasi tidak tersedia"; // Tidak ada di orderDetails
    document.getElementById("concert-date").textContent = "Tanggal tidak tersedia"; // Tidak ada di orderDetails
    document.getElementById("concert-price").textContent = `Rp ${orderDetails.harga.toLocaleString('id-ID')}` ?? "Data tidak tersedia";

    let total = 0;
    let ticketListHTML = "";

    // Menampilkan tiket yang dipesan
    ticketListHTML += `<li>${orderDetails.nama_tiket}: ${orderDetails.jumlah}x</li>`;
    total = orderDetails.subtotal;

    document.querySelector(".order-items ul").innerHTML = ticketListHTML || "<li>Data tiket tidak tersedia</li>";
    document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;
});
