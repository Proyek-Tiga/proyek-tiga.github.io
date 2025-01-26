const token = localStorage.getItem("authToken");

document.addEventListener("DOMContentLoaded", function () {
    const concertDetailsRaw = localStorage.getItem("concertDetails");
    const orderDetailsRaw = localStorage.getItem("orderDetails");
    const transactionId = localStorage.getItem("transactionId"); // Ambil id transaksi

    if (!concertDetailsRaw || !orderDetailsRaw || !transactionId) {
        console.error("Data konser, order, atau transaksi tidak ditemukan di localStorage!");
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

    console.log("Concert Details:", concertDetails);
    console.log("Order Details:", orderDetails);
    console.log("Transaction ID:", transactionId); // Debugging

    if (Array.isArray(orderDetails) && orderDetails.length > 0) {
        orderDetails = orderDetails[0];
    } else {
        console.error("Struktur orderDetails tidak valid!");
        return;
    }

    document.getElementById("concert-name").textContent = concertDetails.nama_konser ?? "Data tidak tersedia";
    document.getElementById("concert-location").textContent = concertDetails.lokasi_name ?? "Lokasi tidak tersedia";
    document.getElementById("concert-date").textContent = new Date(concertDetails.tanggal_konser).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    }) ?? "Tanggal tidak tersedia";
    document.getElementById("concert-price").textContent = `Rp ${concertDetails.harga.toLocaleString('id-ID')}` ?? "Data tidak tersedia";

    document.querySelector(".concert-info img").src = concertDetails.image;
    document.querySelector(".concert-info img").alt = concertDetails.nama_konser;

    let total = orderDetails.subtotal;
    let ticketListHTML = `<li><strong>${orderDetails.nama_tiket}</strong>: ${orderDetails.qty}x - Rp ${orderDetails.harga.toLocaleString('id-ID')}</li>`;

    document.querySelector(".order-items ul").innerHTML = ticketListHTML;
    document.getElementById("total-price").textContent = `Rp ${total.toLocaleString('id-ID')}`;

    // Tambahkan event listener untuk tombol pembayaran
    document.getElementById("pay-now").addEventListener("click", async function () {
        if (!token) {
            alert("Anda harus login terlebih dahulu!");
            return;
        }

        try {
            const user = JSON.parse(atob(token.split(".")[1])); // Decode JWT untuk mendapatkan user_id
            const user_id = user.user_id;

            const paymentURL = `http://localhost:5000/api/payment/${transactionId}`;
            const paymentData = { user_id: user_id };

            const response = await fetch(paymentURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(paymentData)
            });

            if (!response.ok) {
                throw new Error(`Gagal melakukan pembayaran! Status: ${response.status}`);
            }

            const paymentResult = await response.json();
            console.log("Respon Pembayaran:", paymentResult); // Debugging

            if (paymentResult.snap_url) {
                // Redirect ke halaman pembayaran Midtrans
                window.location.href = paymentResult.snap_url;
            } else {
                alert("Gagal mendapatkan URL pembayaran. Coba lagi.");
            }

        } catch (error) {
            console.error("Error saat melakukan pembayaran:", error);
            alert("Terjadi kesalahan saat melakukan pembayaran. Silakan coba lagi.");
        }
    });
});
