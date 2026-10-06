// Zamonaviy mamlakat kodlari va telefon formati qoidalari
const countryList = [
    { code: '+998', flag: '🇺🇿', name: 'Uzbekistan', digits: 9, regex: /^(33|88|90|91|93|94|95|97|98|99|71)\d{7}$/ },
    { code: '+7', flag: '🇰🇿', name: 'Kazakhstan', digits: 10, regex: /^\d{10}$/ },
    { code: '+996', flag: '🇰🇬', name: 'Kyrgyzstan', digits: 9, regex: /^\d{9}$/ },
    { code: '+992', flag: '🇹🇯', name: 'Tajikistan', digits: 9, regex: /^\d{9}$/ },
    { code: '+993', flag: '🇹🇲', name: 'Turkmenistan', digits: 8, regex: /^\d{8}$/ },
    { code: '+1', flag: '🇺🇸', name: 'USA', digits: 10, regex: /^\d{10}$/ },
    { code: '+90', flag: '🇹🇷', name: 'Turkey', digits: 10, regex: /^\d{10}$/ },
    { code: '+91', flag: '🇮🇳', name: 'India', digits: 10, regex: /^\d{10}$/ },
    { code: '+49', flag: '🇩🇪', name: 'Germany', digits: 10, regex: /^\d{10,11}$/ },
    { code: '+44', flag: '🇬🇧', name: 'UK', digits: 10, regex: /^\d{10}$/ }
];

document.addEventListener('DOMContentLoaded', () => {
    const ismInput = document.querySelector('.ism');
    const raqamInput = document.querySelector('.raqam');
    const sendBtn = document.querySelector('.btn-y');
    const menuDiv = document.querySelector('.menu');

    // 1. HTML strukturasiga tegmasdan mamlakatlar tanlovini (Dropdown) dinamik joylashtirish
    const phoneContainer = document.createElement('div');
    phoneContainer.className = 'phone-input-container';

    const selectWrapper = document.createElement('div');
    selectWrapper.className = 'country-select-wrapper';

    const selectEl = document.createElement('select');
    selectEl.className = 'country-select';

    countryList.forEach(c => {
        const option = document.createElement('option');
        option.value = c.code;
        option.textContent = `${c.flag} ${c.code}`;
        selectEl.appendChild(option);
    });

    selectWrapper.appendChild(selectEl);

    // .raqam input elementini yangi container ichiga ko'chirish
    raqamInput.parentNode.insertBefore(phoneContainer, raqamInput);
    phoneContainer.appendChild(selectWrapper);
    phoneContainer.appendChild(raqamInput);

    // Dynamic placeholder o'rnatish
    raqamInput.placeholder = "901234567";

    // Bildirishnoma (Notification Message) elementi
    const feedbackMsg = document.createElement('div');
    feedbackMsg.className = 'feedback-msg';
    sendBtn.parentNode.insertBefore(feedbackMsg, sendBtn);

    // Ism validatsiyasi (Kamida 2 ta harf)
    function validateName(name) {
        const trimmed = name.trim();
        return trimmed.length >= 2 && /^[a-zA-Uz'ʻ`\s\-]+$/i.test(trimmed);
    }

    // Telefon raqami haqiqiyligini tekshirish
    function validatePhone(phone, countryCode) {
        const country = countryList.find(c => c.code === countryCode);
        if (!country) return false;
        
        const cleanPhone = phone.trim().replace(/\D/g, ''); // Faqat raqamlarni ajratish
        return country.regex.test(cleanPhone);
    }

    // Mamlakat o'zgarganda placeholder-ni yangilash
    selectEl.addEventListener('change', () => {
        const selected = countryList.find(c => c.code === selectEl.value);
        if (selected) {
            raqamInput.placeholder = selected.code === '+998' ? '901234567' : `${selected.digits} xonali raqam`;
            validateForm(false);
        }
    });

    function validateForm(showError = true) {
        const ismVal = ismInput.value;
        const raqamVal = raqamInput.value;
        const selectedCountry = selectEl.value;

        const isNameValid = validateName(ismVal);
        const isPhoneValid = validatePhone(raqamVal, selectedCountry);

        // Stil (yashil / qizil) belgilash
        if (ismVal.length > 0) {
            ismInput.classList.toggle('valid', isNameValid);
            ismInput.classList.toggle('invalid', !isNameValid);
        } else {
            ismInput.classList.remove('valid', 'invalid');
        }

        if (raqamVal.length > 0) {
            raqamInput.classList.toggle('valid', isPhoneValid);
            raqamInput.classList.toggle('invalid', !isPhoneValid);
        } else {
            raqamInput.classList.remove('valid', 'invalid');
        }

        if (isNameValid && isPhoneValid) {
            feedbackMsg.className = 'feedback-msg success';
            feedbackMsg.textContent = "Tog'ri kiritildi!";
            return true;
        } else if (showError) {
            feedbackMsg.className = 'feedback-msg error';
            if (!isNameValid && !isPhoneValid) {
                feedbackMsg.textContent = "Ism kiritilmadi va raqam noto'g'ri kiritildi!";
            } else if (!isNameValid) {
                feedbackMsg.textContent = "Ism noto'g'ri kiritildi (kamida 2 ta harf)!";
            } else {
                feedbackMsg.textContent = "Raqam noto'g'ri kiritildi (masalan: 901234567)!";
            }
            return false;
        }
        
        feedbackMsg.style.display = 'none';
        return false;
    }

    // Inputlarga real-time tekshirish o'rnatish
    ismInput.addEventListener('input', () => validateForm(false));
    raqamInput.addEventListener('input', () => validateForm(false));

    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const isValid = validateForm(true);

        if (isValid) {
            feedbackMsg.className = 'feedback-msg success';
            feedbackMsg.textContent = "Tog'ri kiritildi! Yuborilmoqda...";

            // Tugmani o'chirish
            sendBtn.disabled = true;
            sendBtn.style.opacity = '0.7';

            // Ma'lumotlarni sessionStorage ga saqlash
            sessionStorage.setItem('userName', ismInput.value.trim());
            sessionStorage.setItem('userPhone', selectEl.value + raqamInput.value.trim());

            // 1.5 soniyadan so'ng bosh.html ga o'tish
            setTimeout(() => {
                window.location.href = './bosh.html';
            }, 1500);
        }
    });
});