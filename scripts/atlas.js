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

document.addEventListener('DOMContentLoaded', () => {
  const connectWalletBtn = document.getElementById('connectWalletBtn');
  const disconnectWalletBtn = document.getElementById('disconnectWalletBtn');
  const walletInfoDiv = document.getElementById('walletInfo');
  const walletAddressSpan = document.getElementById('walletAddress');
  const chainIdSpan = document.getElementById('chainId');

  // Check if MetaMask is installed
  function isMetaMaskInstalled() {
      return typeof window.ethereum !== 'undefined';
  }

  // Function to connect to MetaMask
  async function connectWallet() {
      if (isMetaMaskInstalled()) {
          try {
              // Request account access
              const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
              const walletAddress = accounts[0];

              // Get chain ID
              const chainId = await window.ethereum.request({ method: 'eth_chainId' });

              // Display wallet info
              walletAddressSpan.textContent = walletAddress;
              chainIdSpan.textContent = chainId;
              walletInfoDiv.style.display = 'block';
              connectWalletBtn.style.display = 'none';

              // Listen for account changes
              window.ethereum.on('accountsChanged', (accounts) => {
                  if (accounts.length === 0) {
                      // Handle disconnection
                      disconnectWallet();
                  } else {
                      walletAddressSpan.textContent = accounts[0];
                  }
              });

              // Listen for chain ID changes
              window.ethereum.on('chainChanged', (newChainId) => {
                  chainIdSpan.textContent = newChainId;
              });
          } catch (error) {
              console.error("User denied account access or error occurred:", error);
              alert("Could not connect wallet. Please make sure MetaMask is unlocked and try again.");
          }
      } else {
          alert("MetaMask is not installed. Please install MetaMask to use this feature.");
      }
  }

  // Function to disconnect wallet
  function disconnectWallet() {
      walletAddressSpan.textContent = '';
      chainIdSpan.textContent = '';
      walletInfoDiv.style.display = 'none';
      connectWalletBtn.style.display = 'block';
  }

  // Event listener for connect wallet button
  connectWalletBtn.addEventListener('click', connectWallet);

  // Event listener for disconnect wallet button
  disconnectWalletBtn.addEventListener('click', disconnectWallet);

  // Check if already connected on page load
  async function checkConnection() {
      if (isMetaMaskInstalled()) {
          try {
              const accounts = await window.ethereum.request({ method: 'eth_accounts' });
              if (accounts.length > 0) {
                  // Already connected
                  const walletAddress = accounts[0];
                  const chainId = await window.ethereum.request({ method: 'eth_chainId' });

                  walletAddressSpan.textContent = walletAddress;
                  chainIdSpan.textContent = chainId;
                  walletInfoDiv.style.display = 'block';
                  connectWalletBtn.style.display = 'none';

                  // Listen for account changes
                  window.ethereum.on('accountsChanged', (accounts) => {
                      if (accounts.length === 0) {
                          // Handle disconnection
                          disconnectWallet();
                      } else {
                          walletAddressSpan.textContent = accounts[0];
                      }
                  });

                  // Listen for chain ID changes
                  window.ethereum.on('chainChanged', (newChainId) => {
                      chainIdSpan.textContent = newChainId;
                  });
              }
          } catch (error) {
              console.error("Error checking connection:", error);
          }
      }
  }

  checkConnection();
});

document.addEventListener('DOMContentLoaded', () => {
    const walletOptions = document.querySelector('.wallet-options');
    const disconnectWalletBtn = document.getElementById('disconnectWalletBtn');
    const walletInfoDiv = document.getElementById('walletInfo');
    const walletAddressSpan = document.getElementById('walletAddress');
    const chainIdSpan = document.getElementById('chainId');

    // Check if MetaMask is installed
    function isMetaMaskInstalled() {
        return typeof window.ethereum !== 'undefined';
    }

    // Function to connect to MetaMask
    async function connectWallet(walletType) {
        if (walletType === 'metamask') {
            if (isMetaMaskInstalled()) {
                try {
                    // Request account access
                    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    const walletAddress = accounts[0];

                    // Get chain ID
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

                    // Display wallet info
                    walletAddressSpan.textContent = walletAddress;
                    chainIdSpan.textContent = chainId;
                    walletInfoDiv.style.display = 'block';
                    walletOptions.style.display = 'none';

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length === 0) {
                            // Handle disconnection
                            disconnectWallet();
                        } else {
                            walletAddressSpan.textContent = accounts[0];
                        }
                    });

                    // Listen for chain ID changes
                    window.ethereum.on('chainChanged', (newChainId) => {
                        chainIdSpan.textContent = newChainId;
                    });
                } catch (error) {
                    console.error("User denied account access or error occurred:", error);
                    alert("Could not connect wallet. Please make sure MetaMask is unlocked and try again.");
                }
            } else {
                alert("MetaMask is not installed. Please install MetaMask to use this feature.");
            }
        } else {
            alert("This wallet type is not supported yet.");
        }
    }

    // Function to disconnect wallet
    function disconnectWallet() {
        walletAddressSpan.textContent = '';
        chainIdSpan.textContent = '';
        walletInfoDiv.style.display = 'none';
        walletOptions.style.display = 'flex';
    }

    // Event listener for connecting a wallet
    walletOptions.addEventListener('click', (event) => {
        const walletCard = event.target.closest('.wallet-card');
        if (walletCard) {
            const walletType = walletCard.dataset.wallet;
            connectWallet(walletType);
        }
    });

    // Event listener for disconnect wallet button
    disconnectWalletBtn.addEventListener('click', disconnectWallet);

    // Check if already connected on page load
    async function checkConnection() {
        if (isMetaMaskInstalled()) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    // Already connected
                    const walletAddress = accounts[0];
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });

                    walletAddressSpan.textContent = walletAddress;
                    chainIdSpan.textContent = chainId;
                    walletInfoDiv.style.display = 'block';
                    walletOptions.style.display = 'none';

                    // Listen for account changes
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length === 0) {
                            // Handle disconnection
                            disconnectWallet();
                        } else {
                            walletAddressSpan.textContent = accounts[0];
                        }
                    });

                    // Listen for chain ID changes
                    window.ethereum.on('chainChanged', (newChainId) => {
                        chainIdSpan.textContent = newChainId;
                    });
                }
            } catch (error) {
                console.error("Error checking connection:", error);
            }
        }
    }

    checkConnection();
});

document.addEventListener('DOMContentLoaded', () => {
  // Thumbnail click changes main image
  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.querySelectorAll('.thumbnail-carousel img');

  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbnails.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      mainImage.src = thumb.src.replace('-thumb', '-large');
      mainImage.alt = thumb.alt;
    });
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  // Expandable product details
  const expandBtn = document.querySelector('.expand-btn');
  const detailsContent = document.getElementById('detailsContent');

  expandBtn.addEventListener('click', () => {
    const expanded = expandBtn.getAttribute('aria-expanded') === 'true';
    expandBtn.setAttribute('aria-expanded', !expanded);
    if (expanded) {
      detailsContent.hidden = true;
      expandBtn.textContent = 'Product Details + Specifications';
    } else {
      detailsContent.hidden = false;
      expandBtn.textContent = 'Hide Details';
    }
  });

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Review form submission (demo only)
  const reviewForm = document.querySelector('.review-form');
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your review! (Demo submission)');
    reviewForm.reset();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.recommended-grid');
  let isDown = false;
  let startX, scrollLeft;

  // Mouse events
  grid.addEventListener('mousedown', (e) => {
    isDown = true;
    grid.classList.add('dragging');
    startX = e.pageX - grid.offsetLeft;
    scrollLeft = grid.scrollLeft;
  });
  grid.addEventListener('mouseleave', () => {
    isDown = false;
    grid.classList.remove('dragging');
  });
  grid.addEventListener('mouseup', () => {
    isDown = false;
    grid.classList.remove('dragging');
  });
  grid.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - grid.offsetLeft;
    const walk = (x - startX) * 1.5; // adjust scroll speed
    grid.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile/fingerprint
  let touchStartX = 0;
  let touchScrollLeft = 0;
  grid.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = grid.scrollLeft;
  });
  grid.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.2; // adjust scroll speed
    grid.scrollLeft = touchScrollLeft - walk;
  });
});