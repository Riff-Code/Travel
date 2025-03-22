// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

navLinks.addEventListener("click", (e) => {
  e.stopPropagation();
});

document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });

    if (navLinks.classList.contains("active")) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      }, 500);
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// ... (kode hamburger menu tetap sama)

// ================== PENYESUAIAN WAKTU SUMATERA BARAT (UTC+7) ==================
const getWIBDate = () => {
  const now = new Date();
  // Tambah offset UTC+7 dan normalisasi ke 00:00:00 WIB
  const wibTime = now.getTime() + 7 * 60 * 60 * 1000;
  return new Date(wibTime).setHours(0, 0, 0, 0);
};

// Set tanggal minimum ke besok WIB
const todayWIB = new Date(getWIBDate());
const tomorrowWIB = new Date(todayWIB);
tomorrowWIB.setDate(todayWIB.getDate() + 1);

// Format tanggal untuk input
const formatDate = (date) => {
  return date.toISOString().slice(0, 10);
};

// Terapkan ke input date
const bookingDate = document.getElementById("bookingDate");
bookingDate.min = formatDate(tomorrowWIB);
bookingDate.value = formatDate(tomorrowWIB); // Set default value

// ================== VALIDASI FORM ==================
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Reset error state
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("invalid");
  });

  // Validasi tanggal
  const selectedDate = new Date(bookingDate.value);
  const selectedWIB = new Date(selectedDate.getTime() + 7 * 60 * 60 * 1000);
  const selectedDateWIB = new Date(selectedWIB.setHours(0, 0, 0, 0));

  if (selectedDateWIB < tomorrowWIB) {
    bookingDate.parentElement.classList.add("invalid");
    return;
  }

  // Validasi nomor HP
  const phoneInput = this.querySelector('input[type="tel"]');
  if (!/^[0-9]{10,13}$/.test(phoneInput.value)) {
    phoneInput.parentElement.classList.add("invalid");
    return;
  }

  // Format pesan WhatsApp
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formData = {
    nama: this.querySelector('input[type="text"]').value,
    phone: phoneInput.value,
    date: formatter.format(selectedDate),
    rute: this.querySelector("select").value,
    penumpang: this.querySelector('input[type="number"]').value,
  };

  const message = `Halo NEW JM Travel, saya ingin memesan:
Nama: ${formData.nama}
Tanggal: ${formData.date}
Rute: ${formData.rute}
Jumlah Penumpang: ${formData.penumpang}
Nomor WhatsApp: ${formData.phone}`;

  const whatsappUrl = `https://wa.me/6285274233345?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
});
