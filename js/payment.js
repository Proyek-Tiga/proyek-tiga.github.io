const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
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
