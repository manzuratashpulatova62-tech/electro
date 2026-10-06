document.addEventListener("DOMContentLoaded", () => {
    // 1. MOBIL MENYU BOSHQRUVI
    const mobileToggle = document.getElementById("mobileToggle");
    const navLinks = document.getElementById("navLinks");

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            const icon = mobileToggle.querySelector("i");
            if (icon) {
                if (navLinks.classList.contains("show")) {
                    icon.className = "fa-solid fa-xmark";
                } else {
                    icon.className = "fa-solid fa-bars";
                }
            }
        });
    }

    // Modal oynani yopish uchun ekran tashqarisiga bosilganda
    const voteModal = document.getElementById("voteModal");
    if (voteModal) {
        voteModal.addEventListener("click", (e) => {
            if (e.target === voteModal) {
                closeVoteModal();
            }
        });
    }

    // Forma yuborilishini tutib qolish (Form Submit)
    const voteForm = document.getElementById("voteForm");
    if (voteForm) {
        voteForm.addEventListener("submit", submitVote);
    }

    // 2. DASTLABKI MA'LUMOTLARNI YUKLASH VA EKRANNI OBNOVLENIYA QILISH
    updateUI();
});

// localStorage'dan ovozlar bazasini olish
function getVotesData() {
    const saved = localStorage.getItem("asar_votes_data");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Data parse error:", e);
        }
    }
    return {
        votes: { 1: 0, 2: 0, 3: 0 }, // Har bir asar uchun ovozlar soni
        voters: {}                    // Ovoz berganlar bazasi: { "+998901234567": "Ism" }
    };
}

// Bazani localStorage'ga saqlash
function saveVotesData(data) {
    localStorage.setItem("asar_votes_data", JSON.stringify(data));
}

// INTERFEYSNI OBNOVLENIYA QILISH (Prosentlar va grafiklar)
function updateUI() {
    const data = getVotesData();

    for (let id = 1; id <= 3; id++) {
        const count = data.votes[id] || 0;
        
        // Target sharti: 1 ovoz = 1%
        const percentage = count; 

        const bar = document.getElementById(`bar-${id}`);
        const percentText = document.getElementById(`percent-${id}`);

        if (bar && percentText) {
            // Maksimal foiz liniyasini 100% bilan cheklaymiz
            bar.style.width = `${Math.min(percentage, 100)}%`;
            percentText.innerText = `${percentage}% (${count} ovoz)`;
        }
    }
}

// MODAL OYNANI OCHISH
function openVoteModal(designId) {
    const selectedInput = document.getElementById("selectedDesignId");
    const modal = document.getElementById("voteModal");

    if (selectedInput && modal) {
        selectedInput.value = designId;
        modal.style.display = "flex";
    }
}

// MODAL OYNANI YOPISH
function closeVoteModal() {
    const modal = document.getElementById("voteModal");
    const form = document.getElementById("voteForm");

    if (modal) {
        modal.style.display = "none";
    }
    if (form) {
        form.reset();
    }
}

// OVOZ YUBORISH (SUBMIT VOTE)
function submitVote(event) {
    event.preventDefault();

    const designId = document.getElementById("selectedDesignId").value;
    const nameInput = document.getElementById("userName");
    const phoneInput = document.getElementById("userPhone");

    if (!nameInput || !phoneInput) return;

    const name = nameInput.value.trim();
    // Telefon raqamidan barcha bo'sh joylar va ortiqcha belgilarni olib tashlaymiz
    const phone = phoneInput.value.trim().replace(/\s+/g, '');

    if (!name || !phone) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    const data = getVotesData();

    // SHART: Telefon raqami bazada bormi yoki yo'qligini tekshirish
    if (data.voters[phone]) {
        const existingName = data.voters[phone];
        alert(`Ushbu telefon raqamidan allaqachon ovoz berilgan! (Foydalanuvchi: ${existingName})`);
        return;
    }

    // Telefon raqami yangi bo'lsa: Ovozni va foydalanuvchini bazaga qo'shamiz
    data.votes[designId] = (data.votes[designId] || 0) + 1;
    data.voters[phone] = name;

    // Bazani saqlash va UI'ni yangilash
    saveVotesData(data);
    updateUI();

    alert(`Rahmat, ${name}! Ovozingiz muvaffaqiyatli qabul qilindi.`);
    closeVoteModal();
}