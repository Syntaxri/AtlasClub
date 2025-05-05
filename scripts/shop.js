document.addEventListener('DOMContentLoaded', () => {
    // GSAP hover scale effect for product cards
    document.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { scale: 1.04, boxShadow: "0 16px 48px rgba(19,80,41,0.25)", duration: 0.3 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { scale: 1, boxShadow: "0 8px 24px rgba(19,80,41,0.15)", duration: 0.3 });
      });
    });

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
