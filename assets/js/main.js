import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";





const firebaseConfig = {
  apiKey: "AIzaSyBaPFUsSH-_n8m4DZ52jIKk6ngYJu3L2cc",
  authDomain: "btpn-syariah-web.firebaseapp.com",
  projectId: "btpn-syariah-web",
  storageBucket: "btpn-syariah-web.firebasestorage.app",
  messagingSenderId: "333489873385",
  appId: "1:333489873385:web:abb367120227978a386b78",
  measurementId: "G-8NQGLJSCLQ"
};

let db = null;
let analytics = null;
let useFirebase = false;


if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    analytics = getAnalytics(app);
    useFirebase = true;
    console.log("Firebase Firestore terhubung dengan sukses!");
  } catch (error) {
    console.error("Gagal menginisialisasi Firebase:", error);
  }
} else {
  console.warn("Firebase belum dikonfigurasi. Menggunakan penyimpanan lokal (localStorage) sementara.");
}

(function () {
  "use strict";


  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);


  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }


  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });


  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });


  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }


  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);


  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);


  const glightbox = GLightbox({
    selector: '.glightbox'
  });


  new PureCounter();


  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);


  const STORAGE_KEYS = {
    feedback: "btpn_feedback_entries",
    registration: "btpn_registration_entries"
  };

  let currentFeedbackEntries = [];
  let currentRegistrationEntries = [];

  function getStoredEntries(key) {
    try {
      return JSON.parse(localStorage.getItem(key)) || [];
    } catch {
      return [];
    }
  }

  function setStoredEntries(key, entries) {
    localStorage.setItem(key, JSON.stringify(entries));
  }

  function renderFeedbackList(entries) {
    const list = document.getElementById('feedback-list');
    if (!list) return;

    if (!entries) {
      entries = getStoredEntries(STORAGE_KEYS.feedback);
    }
    currentFeedbackEntries = entries;

    if (!entries.length) {
      list.innerHTML = '<p class="text-muted">Belum ada kritik atau saran.</p>';
      return;
    }
    list.innerHTML = entries.map(entry => `
      <div class="feedback-entry border rounded p-3 mb-3">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>${entry.name}</strong>
            <p class="mb-1"><small>${entry.email}</small></p>
            <p class="mb-1"><em>${entry.subject}</em></p>
          </div>
          <div>
            <button type="button" class="btn btn-sm btn-outline-primary me-2" data-action="edit" data-id="${entry.id}">Edit</button>
            <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${entry.id}">Hapus</button>
          </div>
        </div>
        <p class="mt-3 mb-0">${entry.message}</p>
      </div>
    `).join('');
  }

  function renderRegistrationList(entries) {
    const list = document.getElementById('registration-list');
    if (!list) return;

    if (!entries) {
      entries = getStoredEntries(STORAGE_KEYS.registration);
    }
    currentRegistrationEntries = entries;

    if (!entries.length) {
      list.innerHTML = '<p class="text-muted">Belum ada calon nasabah.</p>';
      return;
    }
    list.innerHTML = entries.map(entry => `
      <div class="registration-entry border rounded p-3 mb-3">
        <strong>${entry.name}</strong>
        <p class="mb-1"><small>${entry.email} • ${entry.phone}</small></p>
        <p class="mb-0">${entry.address}</p>
      </div>
    `).join('');
  }

  function resetFeedbackForm() {
    const form = document.getElementById('feedback-form');
    form?.reset();
    const submitButton = document.getElementById('feedback-submit');
    const cancelButton = document.getElementById('feedback-cancel');
    if (submitButton) submitButton.textContent = 'Simpan';
    if (cancelButton) cancelButton.classList.add('d-none');
    form?.querySelector('input#feedback-name')?.focus();
    form.removeAttribute('data-edit-id');
  }

  function showMessage(id, text, isError = false) {
    const messageElement = document.getElementById(id);
    if (!messageElement) return;
    messageElement.textContent = text;
    messageElement.className = isError ? 'mt-3 text-danger' : 'mt-3 text-success';
    setTimeout(() => {
      if (messageElement.textContent === text) {
        messageElement.textContent = '';
      }
    }, 3000);
  }

  function initFeedbackAndRegistration() {
    const feedbackForm = document.getElementById('feedback-form');
    const registrationForm = document.getElementById('registration-form');
    const contactForm = document.getElementById('contact-form');
    const feedbackList = document.getElementById('feedback-list');
    const cancelButton = document.getElementById('feedback-cancel');


    if (!useFirebase) {
      const msg = document.getElementById('feedback-form-message');
      if (msg) {
        msg.innerHTML = '<span class="text-warning" style="font-size: 13px;"><i class="bi bi-exclamation-triangle"></i> Menggunakan penyimpanan lokal (Firebase belum dikonfigurasi).</span>';
        setTimeout(() => {
          if (msg.innerHTML.includes("penyimpanan lokal")) msg.textContent = '';
        }, 5000);
      }
    }


    if (useFirebase) {

      const qFeedback = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
      onSnapshot(qFeedback, (snapshot) => {
        const entries = [];
        snapshot.forEach((doc) => {
          entries.push({ id: doc.id, ...doc.data() });
        });
        renderFeedbackList(entries);
      }, (error) => {
        console.error("Gagal memuat feedback dari Firebase:", error);
        renderFeedbackList();
      });


      const qReg = query(collection(db, "registrations"), orderBy("createdAt", "desc"));
      onSnapshot(qReg, (snapshot) => {
        const entries = [];
        snapshot.forEach((doc) => {
          entries.push({ id: doc.id, ...doc.data() });
        });
        renderRegistrationList(entries);
      }, (error) => {
        console.error("Gagal memuat pendaftaran dari Firebase:", error);
        renderRegistrationList();
      });
    } else {
      renderFeedbackList();
      renderRegistrationList();
    }

    contactForm?.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = contactForm.querySelector('input[name="email"]')?.value.trim();
      if (!email) {
        showMessage('contact-form-message', 'Email harus diisi.', true);
        return;
      }
      contactForm.reset();
      showMessage('contact-form-message', 'Pesan berhasil dikirim. Terima kasih.');
    });

    feedbackForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('feedback-name')?.value.trim();
      const email = document.getElementById('feedback-email')?.value.trim();
      const subject = document.getElementById('feedback-subject')?.value.trim();
      const message = document.getElementById('feedback-message')?.value.trim();
      const editId = feedbackForm.getAttribute('data-edit-id');

      if (!name || !email || !subject || !message) {
        showMessage('feedback-form-message', 'Semua kolom harus diisi.', true);
        return;
      }

      const submitButton = document.getElementById('feedback-submit');
      if (submitButton) submitButton.disabled = true;

      try {
        if (useFirebase) {
          if (editId) {

            const docRef = doc(db, "feedback", editId);
            await updateDoc(docRef, {
              name,
              email,
              subject,
              message,
              updatedAt: new Date().toISOString()
            });
            showMessage('feedback-form-message', 'Kritik / saran berhasil diperbarui.');
          } else {

            await addDoc(collection(db, "feedback"), {
              name,
              email,
              subject,
              message,
              createdAt: new Date().toISOString()
            });
            showMessage('feedback-form-message', 'Kritik / saran berhasil disimpan.');
          }
        } else {

          const entries = getStoredEntries(STORAGE_KEYS.feedback);
          if (editId) {
            const index = entries.findIndex(entry => entry.id === editId);
            if (index !== -1) {
              entries[index] = { ...entries[index], name, email, subject, message, updatedAt: new Date().toISOString() };
              setStoredEntries(STORAGE_KEYS.feedback, entries);
              showMessage('feedback-form-message', 'Kritik / saran berhasil diperbarui.');
            }
          } else {
            entries.unshift({
              id: `fb-${Date.now()}`,
              name,
              email,
              subject,
              message,
              createdAt: new Date().toISOString()
            });
            setStoredEntries(STORAGE_KEYS.feedback, entries);
            showMessage('feedback-form-message', 'Kritik / saran berhasil disimpan.');
          }
          renderFeedbackList();
        }
        resetFeedbackForm();
      } catch (error) {
        console.error("Gagal memproses feedback:", error);
        showMessage('feedback-form-message', 'Gagal memproses data.', true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });

    feedbackList?.addEventListener('click', async (event) => {
      const button = event.target.closest('button[data-action]');
      if (!button) return;
      const action = button.getAttribute('data-action');
      const id = button.getAttribute('data-id');

      if (action === 'edit') {
        const entry = currentFeedbackEntries.find(item => item.id === id);
        if (!entry) return;
        document.getElementById('feedback-name').value = entry.name;
        document.getElementById('feedback-email').value = entry.email;
        document.getElementById('feedback-subject').value = entry.subject;
        document.getElementById('feedback-message').value = entry.message;
        feedbackForm.setAttribute('data-edit-id', id);
        document.getElementById('feedback-submit').textContent = 'Perbarui';
        cancelButton?.classList.remove('d-none');
      }

      if (action === 'delete') {
        if (confirm("Apakah Anda yakin ingin menghapus kritik/saran ini?")) {
          try {
            if (useFirebase) {
              const docRef = doc(db, "feedback", id);
              await deleteDoc(docRef);
              showMessage('feedback-form-message', 'Kritik / saran berhasil dihapus.');
            } else {
              const filtered = currentFeedbackEntries.filter(item => item.id !== id);
              setStoredEntries(STORAGE_KEYS.feedback, filtered);
              renderFeedbackList();
              showMessage('feedback-form-message', 'Kritik / saran berhasil dihapus.');
            }
            resetFeedbackForm();
          } catch (error) {
            console.error("Gagal menghapus data:", error);
            showMessage('feedback-form-message', 'Gagal menghapus data.', true);
          }
        }
      }
    });

    cancelButton?.addEventListener('click', () => {
      resetFeedbackForm();
    });

    registrationForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('registration-name')?.value.trim();
      const email = document.getElementById('registration-email')?.value.trim();
      const phone = document.getElementById('registration-phone')?.value.trim();
      const address = document.getElementById('registration-address')?.value.trim();

      if (!name || !email || !phone || !address) {
        showMessage('registration-form-message', 'Semua kolom harus diisi.', true);
        return;
      }

      const submitButton = registrationForm.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;

      try {
        if (useFirebase) {
          await addDoc(collection(db, "registrations"), {
            name,
            email,
            phone,
            address,
            createdAt: new Date().toISOString()
          });
          showMessage('registration-form-message', 'Pendaftaran nasabah berhasil dikirim.');
        } else {
          const entries = getStoredEntries(STORAGE_KEYS.registration);
          entries.unshift({
            id: `reg-${Date.now()}`,
            name,
            email,
            phone,
            address,
            createdAt: new Date().toISOString()
          });
          setStoredEntries(STORAGE_KEYS.registration, entries);
          renderRegistrationList();
          showMessage('registration-form-message', 'Pendaftaran nasabah berhasil dikirim.');
        }
        registrationForm.reset();
      } catch (error) {
        console.error("Gagal mendaftarkan nasabah:", error);
        showMessage('registration-form-message', 'Gagal mengirim pendaftaran.', true);
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  window.addEventListener('load', initFeedbackAndRegistration);

})();