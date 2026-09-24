import '../css/main.scss';

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');
  const openModalBtn = document.getElementById('open-modal-btn');
  const closeModalBtn = document.getElementById('modal-close');
  const modalOverlay = document.getElementById('modal-overlay');


  const track = document.getElementById('carousel-track');
  const slides = track ? Array.from(track.children) : [];
  const nextButton = document.getElementById('carousel-next');
  const prevButton = document.getElementById('carousel-prev');

  const dotsNav = document.getElementById('carousel-nav');
  const dots = dotsNav ? Array.from(dotsNav.children) : [];

  let currentSlideIndex = 0;


  let isClickScrolling = false;
  let clickTimeout = null;

  const setActiveLink = (targetId) => {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === targetId);
    });
  };

  const handleScroll = () => {
    if (!navbar) return;
    const scrollPosition = window.scrollY;

    // Navbar Resizing
    if (scrollPosition > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    if (isClickScrolling) return;

    const navBottom = navbar.getBoundingClientRect().bottom;
    const windowBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    

    const isAtBottom = windowBottom >= documentHeight - 15;

    let currentSectionId = '';

    if (isAtBottom && sections.length > 0) {
      currentSectionId = sections[sections.length - 1].getAttribute('id');
    } else {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= navBottom + 5 && rect.bottom > navBottom + 5) {
          currentSectionId = section.getAttribute('id');
        }
      });
    }

    if (currentSectionId) {
      setActiveLink(currentSectionId);
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();





  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const cleanId = targetId.replace('#', '');
        setActiveLink(cleanId);

        isClickScrolling = true;
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(() => {
          isClickScrolling = false;
          handleScroll();
        }, 600);

        

        if (cleanId === 'hero') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const targetOffset = targetSection.offsetTop - 54;
          window.scrollTo({ top: targetOffset, behavior: 'smooth' });
        }

        history.pushState(null, '', targetId);
      }
    });
  });
  
 
  //Carousel part
  const moveToSlide = (targetIndex) => {
    if (!track || slides.length === 0) return;

    if (targetIndex < 0) {
      currentSlideIndex = slides.length - 1;
    } else if (targetIndex >= slides.length) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = targetIndex;
    }

    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('current-indicator', index === currentSlideIndex);
    });
  };

  if (prevButton && nextButton) {
    prevButton.addEventListener('click', () => moveToSlide(currentSlideIndex - 1));
    nextButton.addEventListener('click', () => moveToSlide(currentSlideIndex + 1));
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => moveToSlide(index));
  });


  const openModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (openModalBtn) {
    openModalBtn.addEventListener('click', openModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (event) => {
      if (event.target === modalOverlay) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('open')) {
      closeModal();
    }
  });
});