document.addEventListener("DOMContentLoaded", () => {
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelector(".nav-links");

    // Elementlar topilmasa skript xato bermasligi uchun tekshiruv
    if (!navbar || !navLinks) return;

    // 1. Mobil ekranda ko'rinadigan tugma (button) yaratamiz
    const menuBtn = document.createElement("button");
    menuBtn.className = "mobile-menu-btn";
    menuBtn.setAttribute("type", "button");
    menuBtn.setAttribute("aria-label", "Menyuni ochish");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';

    // 2. Tugmani header (navbar) ichiga qo'shamiz
    navbar.appendChild(menuBtn);

    // 3. Tugmaga bosilganda menyuni ochish va yopish
    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        
        const isOpen = navLinks.classList.toggle("show");
        menuBtn.classList.toggle("active", isOpen);

        // Ikonkani o'zgartirish (bars -> xmark)
        if (isOpen) {
            menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    // 4. Ekran bo'sh joyiga bosilganda menyuni yopish
    document.addEventListener("click", (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains("show")) {
            navLinks.classList.remove("show");
            menuBtn.classList.remove("active");
            menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });
});