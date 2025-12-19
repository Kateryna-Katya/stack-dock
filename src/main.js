/**
 * STACK-DOCK.ORG — Официальный скрипт платформы
 * Функционал: Анимации, Мобильное меню, Валидация, Капча, Cookies
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Инициализация иконок Lucide ---
  if (typeof lucide !== 'undefined') {
      lucide.createIcons();
  }

  // --- 2. Продвинутые анимации (GSAP + SplitType) ---
  const heroTitleElement = document.querySelector('#hero-title');

  if (heroTitleElement && typeof SplitType !== 'undefined' && typeof gsap !== 'undefined') {
      // РЕШЕНИЕ: Разбиваем на words и chars.
      // В CSS .word должен иметь white-space: nowrap
      const text = new SplitType(heroTitleElement, {
          types: 'words, chars',
          tagName: 'span'
      });

      const tl = gsap.timeline({ delay: 0.4 });

      tl.from(text.chars, {
          opacity: 0,
          y: 40,
          rotateX: -100,
          stagger: 0.02,
          duration: 0.8,
          ease: "power4.out"
      })
      .from('.hero__badge', { opacity: 0, scale: 0.8, duration: 0.5 }, "-=0.6")
      .from('.hero__subtitle', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from('.hero__btns', { opacity: 0, y: 20, duration: 0.6 }, "-=0.4")
      .from('.hero__visual', {
          opacity: 0,
          scale: 0.9,
          x: 30,
          duration: 1.2,
          ease: "expo.out"
      }, "-=1");
  }

  // --- 3. Мобильное меню (Полный цикл управления) ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const body = document.body;

  if (burger && nav) {
      const toggleMenu = (state) => {
          const isOpen = state !== undefined ? state : !nav.classList.contains('nav--active');

          burger.classList.toggle('burger--active', isOpen);
          nav.classList.toggle('nav--active', isOpen);
          body.style.overflow = isOpen ? 'hidden' : ''; // Блокировка скролла
      };

      burger.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu();
      });

      // Закрытие по клику на ссылки
      navLinks.forEach(link => {
          link.addEventListener('click', () => toggleMenu(false));
      });

      // Закрытие по клику вне меню
      document.addEventListener('click', (e) => {
          if (nav.classList.contains('nav--active') && !nav.contains(e.target) && e.target !== burger) {
              toggleMenu(false);
          }
      });
  }

  // --- 4. Хедер: Эффект при скролле ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
          header.style.padding = '12px 0';
          header.style.background = 'rgba(15, 17, 21, 0.98)';
          header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
      } else {
          header.style.padding = '20px 0';
          header.style.background = 'rgba(15, 17, 21, 0.8)';
          header.style.boxShadow = 'none';
      }
  });

  // --- 5. Валидация телефона (Только цифры) ---
  const phoneInput = document.getElementById('phoneInput');
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          e.target.value = e.target.value.replace(/[^0-9+]/g, '');
      });
  }

  // --- 6. Математическая Капча и Форма ---
  const captchaLabel = document.getElementById('captchaLabel');
  const captchaInput = document.getElementById('captchaInput');
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (captchaLabel && contactForm) {
      const n1 = Math.floor(Math.random() * 8) + 2;
      const n2 = Math.floor(Math.random() * 9) + 1;
      const result = n1 + n2;

      captchaLabel.innerText = `Подтвердите, что вы не робот: ${n1} + ${n2} = ?`;

      contactForm.addEventListener('submit', (e) => {
          e.preventDefault();

          // Проверка капчи
          if (parseInt(captchaInput.value) !== result) {
              alert('Неверный результат капчи. Пожалуйста, попробуйте снова.');
              return;
          }

          // Имитация отправки
          const btn = contactForm.querySelector('button');
          const originalText = btn.innerText;

          btn.disabled = true;
          btn.innerText = 'Отправка данных...';

          setTimeout(() => {
              btn.disabled = false;
              btn.innerText = originalText;

              formMessage.innerText = 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
              formMessage.style.display = 'block';
              formMessage.classList.add('success');

              contactForm.reset();

              setTimeout(() => {
                  formMessage.style.display = 'none';
              }, 6000);
          }, 1800);
      });
  }

  // --- 7. Cookie Popup (LocalStorage) ---
  const cookiePopup = document.getElementById('cookiePopup');
  const acceptCookies = document.getElementById('acceptCookies');

  if (cookiePopup && !localStorage.getItem('sd_cookies_accepted')) {
      // Показываем плашку через 3 секунды
      setTimeout(() => {
          cookiePopup.style.display = 'block';
          if (typeof gsap !== 'undefined') {
              gsap.fromTo(cookiePopup, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 });
          }
      }, 3000);
  }

  if (acceptCookies) {
      acceptCookies.addEventListener('click', () => {
          localStorage.setItem('sd_cookies_accepted', 'true');
          if (typeof gsap !== 'undefined') {
              gsap.to(cookiePopup, { y: 100, opacity: 0, duration: 0.5, onComplete: () => {
                  cookiePopup.style.display = 'none';
              }});
          } else {
              cookiePopup.style.display = 'none';
          }
      });
  }
});