document.addEventListener('DOMContentLoaded', () => {
  // Next/Prev slide controls
  let next = document.querySelector('.next');
  let prev = document.querySelector('.prev');
  let slide = document.querySelector('.slide');

  if (next && prev && slide) {
    next.addEventListener('click', () => {
      let items = document.querySelectorAll('.item');
      if (items.length > 0) slide.appendChild(items[0]);
    });

    prev.addEventListener('click', () => {
      let items = document.querySelectorAll('.item');
      if (items.length > 0) slide.prepend(items[items.length - 1]);
    });
  }

  // Scroll reveal observer
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  scrollElements.forEach(el => scrollRevealObserver.observe(el));

  // Play NFT videos on hover (exclude auto-play videos)
  document.querySelectorAll('.nft-item').forEach(card => {
    const video = card.querySelector('video:not(.auto-play)');
    if (!video) return;

    card.addEventListener('mouseenter', () => {
      video.play();
      card.classList.add('playing');
    });

    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      card.classList.remove('playing');
    });
  });

  // Play NFT videos on scroll into view (exclude auto-play videos)
  const nftVideoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video:not(.auto-play)');
      if (!video) return;

      if (entry.isIntersecting) {
        video.play();
        entry.target.classList.add('playing');
      } else {
        video.pause();
        video.currentTime = 0;
        entry.target.classList.remove('playing');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.nft-item').forEach(card => {
    nftVideoObserver.observe(card);
  });

  // Debug: Check if content overflows horizontally
  console.log('Horizontal overflow:', document.documentElement.scrollWidth > window.innerWidth);

  // Mobile carousel touch functionality
  function enableMobileCarousel() {
    function onItemClick(e) {
      if (window.innerWidth > 700) return; // Only on mobile
      const slide = document.querySelector('.slide');
      // Only move if not already the first item
      if (slide.firstElementChild !== this) {
        slide.insertBefore(this, slide.firstElementChild);
        updateCarouselClasses();
      }
    }

    function updateCarouselClasses() {
      // Remove all mobile-active classes
      document.querySelectorAll('.item').forEach(item => {
        item.classList.remove('mobile-active');
      });
      // Add to the first item (now at the front)
      if (slide.firstElementChild) {
        slide.firstElementChild.classList.add('mobile-active');
      }
    }

    const items = document.querySelectorAll('.item');
    // Remove previous listeners to avoid duplicates
    items.forEach(item => {
      item.removeEventListener('click', onItemClick);
      item.addEventListener('click', onItemClick);
    });
  }

  // Call on load and on resize (in case of orientation change)
  enableMobileCarousel();
  window.addEventListener('resize', enableMobileCarousel);
});

// Hamburger menu logic for mobile
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });

  // Optional: Close nav when clicking a link (for smooth UX)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  });

  // GSAP hover scale effect for product cards
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.04, boxShadow: "0 16px 48px rgba(19,80,41,0.25)", duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, boxShadow: "0 8px 24px rgba(19,80,41,0.15)", duration: 0.3 });
    });
  });

  // Initialize AOS
  AOS.init({
    duration: 900,
    once: true,
    easing: 'ease-in-out'
  });
});
