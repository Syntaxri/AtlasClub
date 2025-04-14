document.querySelectorAll('.carousel__scroll-wrapper').forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const items = track.querySelectorAll('.carousel__item');
    const containerWidth = carousel.offsetWidth;
    let isScrolling = false;
    let lastScrollX = 0;
    let scrollDirection = 0;
  
    // Clone first and last items for seamless looping
    const firstClone = items[0].cloneNode(true);
    const lastClone = items[items.length - 1].cloneNode(true);
    track.appendChild(firstClone);
    track.insertBefore(lastClone, items[0]);
  
    carousel.addEventListener('scroll', () => {
      const scrollLeft = carousel.scrollLeft;
      const maxScroll = track.scrollWidth - containerWidth;
      const deltaX = scrollLeft - lastScrollX;
      
      // Detect scroll direction
      scrollDirection = Math.sign(deltaX);
      lastScrollX = scrollLeft;
  
      // Check if we need to loop (with 100px threshold)
      if (scrollLeft <= 100) {
        // When scrolling left past beginning
        track.style.transition = 'none';
        carousel.scrollLeft = maxScroll - containerWidth - 100;
        track.style.transition = '';
      } else if (scrollLeft >= maxScroll - 100) {
        // When scrolling right past end
        track.style.transition = 'none';
        carousel.scrollLeft = 100;
        track.style.transition = '';
      }
    });
  
    // Smooth scroll handling
    let animationFrame;
    carousel.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (animationFrame) cancelAnimationFrame(animationFrame);
      
      const delta = Math.max(-1, Math.min(1, (e.deltaY || -e.detail)));
      animationFrame = requestAnimationFrame(() => {
        carousel.scrollLeft += delta * 50;
      });
    });
  
    // Initialize scroll position
    carousel.scrollLeft = containerWidth;
  });