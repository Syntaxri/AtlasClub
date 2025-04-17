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
});