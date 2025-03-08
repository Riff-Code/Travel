// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Prevent closing saat klik menu
navLinks.addEventListener("click", (e) => {
  e.stopPropagation();
});

// Close menu saat klik di luar
document.addEventListener("click", (e) => {
  if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  }
});

// Smooth scroll untuk nav link
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });

    // Close menu mobile setelah klik link
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

// Handle resize window
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    navLinks.classList.remove("active");
    hamburger.classList.remove("active");
  }
});

// Set minimum date (Hanya bisa pilih mulai besok)
const today = new Date();
const todayDate = new Date(
  today.getFullYear(),
  today.getMonth(),
  today.getDate()
); // Normalisasi ke 00:00:00 waktu lokal

// Set tanggal minimum ke besok
const tomorrow = new Date(todayDate);
tomorrow.setDate(todayDate.getDate() + 1);

// Format tanggal untuk input (YYYY-MM-DD)
const formattedTomorrow = `${tomorrow.getFullYear()}-${String(
  tomorrow.getMonth() + 1
).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

// Terapkan ke input date
const bookingDate = document.getElementById("bookingDate");
bookingDate.min = formattedTomorrow;

// Form Submission to WhatsApp
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear error state
  document.querySelectorAll(".form-group").forEach((group) => {
    group.classList.remove("invalid");
  });

  // Validasi tanggal
  const selectedDate = new Date(bookingDate.value);
  const selectedDateLocal = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  if (selectedDateLocal < tomorrow) {
    bookingDate.parentElement.classList.add("invalid");
    return;
  }

  // Validasi nomor telepon
  const phoneInput = this.querySelector('input[type="tel"]');
  if (!/^[0-9]{10,13}$/.test(phoneInput.value)) {
    phoneInput.parentElement.classList.add("invalid");
    return;
  }

  // Jika semua valid, kirim ke WhatsApp
  const formData = {
    nama: this.querySelector('input[type="text"]').value,
    phone: phoneInput.value,
    date: bookingDate.value,
    rute: this.querySelector("select").value,
    penumpang: this.querySelector('input[type="number"]').value,
  };

  const message = `Halo NEW JM Travel, saya ingin memesan:\n
Nama: ${formData.nama}
Tanggal: ${formData.date}
Rute: ${formData.rute}
Jumlah Penumpang: ${formData.penumpang}
Nomor WhatsApp: ${formData.phone}`;

  const whatsappUrl = `https://wa.me/6289516294021?text=${encodeURIComponent(
    message
  )}`;
  window.open(whatsappUrl, "_blank");
});
