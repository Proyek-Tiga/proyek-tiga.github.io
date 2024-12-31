// Ambil semua elemen link di navbar
const navItems = document.querySelectorAll('.nav-center .nav-item');

// Ambil path URL saat ini
const currentPath = window.location.pathname;

// Tambahkan class active ke elemen yang cocok dengan path URL
navItems.forEach(item => {
    if (item.href.includes(currentPath)) {
        item.classList.add('active');
    }
});

