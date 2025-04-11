/**
 * E-commerce Landing Page JavaScript
 * Handles all interactive elements of the page
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const cartToggle = document.querySelector('.cart-toggle');
  const cartDropdown = document.querySelector('.cart-dropdown');
  const overlay = document.querySelector('.overlay');
  const mainProductImage = document.getElementById('main-product-image');
  const thumbnailBtns = document.querySelectorAll('.product__thumbnail-btn');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox__image');
  const lightboxThumbnailBtns = document.querySelectorAll('.lightbox__thumbnail-btn');
  const lightboxCloseBtn = document.querySelector('.lightbox__close');
  const quantityMinusBtn = document.querySelector('.quantity-selector__btn--minus');
  const quantityPlusBtn = document.querySelector('.quantity-selector__btn--plus');
  const quantityInput = document.querySelector('.quantity-selector__input');
  const addToCartBtn = document.querySelector('.add-to-cart-btn');
  const cartItemDeleteBtn = document.querySelector('.cart-item__delete');
  const cartEmptyState = document.querySelector('.cart-dropdown__empty');
  const cartFilledState = document.querySelector('.cart-dropdown__filled');
  const cartItemQuantity = document.querySelector('.cart-item__quantity');
  const cartItemTotal = document.querySelector('.cart-item__total');
  const cartCount = document.querySelector('.cart-toggle__count');
  const galleryPrevBtns = document.querySelectorAll('.gallery-control--prev');
  const galleryNextBtns = document.querySelectorAll('.gallery-control--next');
  
  // Product data
  const product = {
    name: 'Fall Limited Edition Sneakers',
    price: 125.00,
    originalPrice: 250.00,
    discount: 50,
    images: [
      'images/image-product-1.jpg',
      'images/image-product-2.jpg',
      'images/image-product-3.jpg',
      'images/image-product-4.jpg'
    ],
    thumbnails: [
      'images/image-product-1-thumbnail.jpg',
      'images/image-product-2-thumbnail.jpg',
      'images/image-product-3-thumbnail.jpg',
      'images/image-product-4-thumbnail.jpg'
    ]
  };
  
  // State
  let currentImageIndex = 0;
  let cartQuantity = 0;
  
  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    overlay.classList.toggle('hidden', !nav.classList.contains('active'));
    document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Cart Toggle
  cartToggle.addEventListener('click', () => {
    cartDropdown.classList.toggle('active');
    cartToggle.setAttribute('aria-expanded', cartDropdown.classList.contains('active'));
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!cartToggle.contains(e.target) && !cartDropdown.contains(e.target)) {
      cartDropdown.classList.remove('active');
      cartToggle.setAttribute('aria-expanded', 'false');
    }
    
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && window.innerWidth <= 768) {
      nav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      overlay.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });
  
  // Product Gallery Thumbnails
  thumbnailBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      setActiveImage(index);
    });
  });
  
  // Lightbox Thumbnails
  lightboxThumbnailBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      setActiveLightboxImage(index);
    });
  });
  
  // Open Lightbox
  mainProductImage.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      lightbox.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      setActiveLightboxImage(currentImageIndex);
    }
  });
  
  // Close Lightbox
  lightboxCloseBtn.addEventListener('click', () => {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  });
  
  // Quantity Selector
  quantityMinusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 0) {
      quantityInput.value = currentValue - 1;
    }
  });
  
  quantityPlusBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
  
  quantityInput.addEventListener('change', () => {
    if (quantityInput.value < 0) {
      quantityInput.value = 0;
    }
  });
  
  // Add to Cart
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    if (quantity > 0) {
      updateCart(quantity);
      showNotification(`Added ${quantity} item${quantity > 1 ? 's' : ''} to cart`);
      quantityInput.value = 0;
    }
  });
  
  // Remove from Cart
  cartItemDeleteBtn.addEventListener('click', () => {
    clearCart();
  });
  
  // Gallery Navigation
  galleryPrevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateGallery('prev');
    });
  });
  
  galleryNextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateGallery('next');
    });
  });
  
  // Swipe detection for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  const productMainImage = document.querySelector('.product__main-image');
  
  productMainImage.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  productMainImage.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  // Helper Functions
  function setActiveImage(index) {
    currentImageIndex = index;
    mainProductImage.src = product.images[index];
    
    thumbnailBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }
  
  function setActiveLightboxImage(index) {
    currentImageIndex = index;
    lightboxImage.src = product.images[index];
    mainProductImage.src = product.images[index];
    
    lightboxThumbnailBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
    
    thumbnailBtns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }
  
  function navigateGallery(direction) {
    if (direction === 'prev') {
      currentImageIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
    } else {
      currentImageIndex = (currentImageIndex + 1) % product.images.length;
    }
    
    if (lightbox.classList.contains('hidden')) {
      setActiveImage(currentImageIndex);
    } else {
      setActiveLightboxImage(currentImageIndex);
    }
  }
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      navigateGallery('next');
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      navigateGallery('prev');
    }
  }
  
  function updateCart(quantity) {
    cartQuantity = quantity;
    cartCount.textContent = cartQuantity;
    cartCount.classList.toggle('hidden', cartQuantity === 0);
    
    if (cartQuantity > 0) {
      cartEmptyState.classList.add('hidden');
      cartFilledState.classList.remove('hidden');
      cartItemQuantity.textContent = cartQuantity;
      cartItemTotal.textContent = `$${(product.price * cartQuantity).toFixed(2)}`;
    } else {
      clearCart();
    }
  }
  
  function clearCart() {
    cartQuantity = 0;
    cartCount.textContent = '0';
    cartCount.classList.add('hidden');
    cartEmptyState.classList.remove('hidden');
    cartFilledState.classList.add('hidden');
  }
  
  function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = 'var(--color-orange)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s, transform 0.3s';
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }
  
  // Initialize
  setActiveImage(0);
  clearCart();
});
