const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

    if (!orderDetails) {
        console.error("Order details not found in localStorage!");
        return;
    }

    document.getElementById("concert-name").textContent = orderDetails.concertName || "Data tidak tersedia";
    document.getElementById("concert-location").textContent = orderDetails.concertLocation || "Data tidak tersedia";
    document.getElementById("concert-date").textContent = orderDetails.concertDate || "Data tidak tersedia";
    document.getElementById("concert-price").textContent = orderDetails.concertPrice || "Data tidak tersedia";

    let total = 0;
    let ticketListHTML = "";

    if (orderDetails.tickets && typeof orderDetails.tickets === "object") {
        Object.keys(orderDetails.tickets).forEach(ticketId => {
            const quantity = orderDetails.tickets[ticketId];
            if (quantity > 0) {
                ticketListHTML += `<li>Tiket ID ${ticketId}: ${quantity}x</li>`;
                total += quantity * 50000; // Ganti dengan harga tiket aktual
            }
        });
    } else {
        console.error("Tickets data is missing or invalid!");
    }

    document.querySelector(".order-items ul").innerHTML = ticketListHTML || "<li>Data tiket tidak tersedia</li>";
    document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;
});
