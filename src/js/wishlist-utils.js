import {
  isProductInWishlist,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from './storage.js';
import { renderHomeProducts, updateWishlistCount } from './render-function.js';
import { getProductById } from './products-api.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import refs from './refs.js';


export function setupWishlistButton(productId) {
  const wishlistBtn = document.querySelector('.modal-product__btn--wishlist');
  if (!wishlistBtn) return;

  wishlistBtn.textContent = isProductInWishlist(productId)
    ? 'Remove from Wishlist'
    : 'Add to Wishlist';

  const newWishlistBtn = wishlistBtn.cloneNode(true);
  wishlistBtn.parentNode.replaceChild(newWishlistBtn, wishlistBtn);

  newWishlistBtn.addEventListener('click', async () => {
    if (isProductInWishlist(productId)) {
      removeFromWishlist(productId);
      newWishlistBtn.textContent = 'Add to Wishlist';
      iziToast.success({
        title: 'Success',
        message: 'Product removed from Wishlist',
        position: 'topRight',
      });
    } else {
      addToWishlist(productId);
      newWishlistBtn.textContent = 'Remove from Wishlist';
      iziToast.success({
        title: 'Success',
        message: 'Product added to Wishlist',
        position: 'topRight',
      });
    }

    updateWishlistCount();

    // Якщо ми зараз на сторінці wishlist — оновлюємо її
    if (window.location.pathname.includes('wishlist.html')) {
      await loadWishlistProducts();
    }
  });
}

// Функція для завантаження wishlist товарів
export async function loadWishlistProducts() {
  const wishlist = getWishlist();

  if (wishlist.length === 0) {
    refs.products.innerHTML =
      '<p class="empty-message">Your wishlist is empty.</p>';
    return;
  }

  try {
    const productPromises = wishlist.map(id => getProductById(id));
    const products = await Promise.all(productPromises);

    renderHomeProducts(products);
  } catch (error) {
    console.error('Error loading wishlist products:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to load wishlist products.',
      position: 'topRight',
    });
  }
}
