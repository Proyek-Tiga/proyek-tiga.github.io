const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const concertDetailsRaw = localStorage.getItem("concertDetails");
    const orderDetailsRaw = localStorage.getItem("orderDetails");

    if (!concertDetailsRaw || !orderDetailsRaw) {
        console.error("Data konser atau order tidak ditemukan di localStorage!");
        return;
    }

    let concertDetails, orderDetails;

    try {
        concertDetails = JSON.parse(concertDetailsRaw);
        orderDetails = JSON.parse(orderDetailsRaw);
    } catch (error) {
        console.error("Gagal parsing JSON:", error);
        return;
    }

    console.log("Concert Details from localStorage:", concertDetails);
    console.log("Order Details from localStorage:", orderDetails);

    // Pastikan orderDetails adalah array dan ambil elemen pertama
    if (Array.isArray(orderDetails) && orderDetails.length > 0) {
        orderDetails = orderDetails[0]; // Ambil elemen pertama
    } else {
        console.error("Struktur orderDetails tidak valid!");
        return;
    }

    // Tampilkan data konser
    document.getElementById("concert-name").textContent = concertDetails.nama_konser ?? "Data tidak tersedia";
    document.getElementById("concert-location").textContent = concertDetails.lokasi_name ?? "Lokasi tidak tersedia";
    document.getElementById("concert-date").textContent = new Date(concertDetails.tanggal_konser).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) ?? "Tanggal tidak tersedia";
    document.getElementById("concert-price").textContent = `Rp ${concertDetails.harga.toLocaleString('id-ID')}` ?? "Data tidak tersedia";

    // Tampilkan gambar konser
    document.querySelector(".concert-info img").src = concertDetails.image;
    document.querySelector(".concert-info img").alt = concertDetails.nama_konser;

    // Menampilkan tiket yang dipesan
    let total = orderDetails.subtotal;
    let ticketListHTML = `<li><strong>${orderDetails.nama_tiket}</strong>: ${orderDetails.jumlah}x - Rp ${orderDetails.harga.toLocaleString('id-ID')}</li>`;

    document.querySelector(".order-items ul").innerHTML = ticketListHTML;
    document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;
});
