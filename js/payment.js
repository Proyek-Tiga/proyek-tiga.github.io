const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const orderDetails = JSON.parse(localStorage.getItem("orderDetails"));

    if (orderDetails) {
        document.getElementById("concert-name").textContent = orderDetails.concertName;
        document.getElementById("concert-location").textContent = orderDetails.concertLocation;
        document.getElementById("concert-date").textContent = orderDetails.concertDate;
        document.getElementById("concert-price").textContent = orderDetails.concertPrice;

        let total = 0;
        let ticketListHTML = "";

        Object.keys(orderDetails.tickets).forEach(ticketId => {
            const quantity = orderDetails.tickets[ticketId];
            if (quantity > 0) {
                ticketListHTML += `<li>Tiket ID ${ticketId}: ${quantity}x</li>`;
                total += quantity * 50000; // Ganti 50000 dengan harga tiket aktual
            }
        });

        document.querySelector(".order-items ul").innerHTML = ticketListHTML;
        document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }
});
