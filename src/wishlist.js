import refs from './js/refs.js';
import { saveSelectedCategory } from './js/storage.js';
import { getCategories } from './js/products-api.js';
import {
  onItemClick,
  updateWishlistCount,
  renderCategories,
} from './js/render-function.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { loadWishlistProducts } from './js/wishlist-utils.js';

try {
  const categories = await getCategories();
  renderCategories(categories);
  loadWishlistProducts();
  updateWishlistCount();
} catch (error) {
  iziToast.error({
    title: 'Error',
    message: 'Failed to fetch categories. Please try again later.',
    position: 'topRight',
  });
  console.error('Error fetching categories:', error);
}
//========== Делегування кліку на картки товарів ===========
refs.products.addEventListener('click', onItemClick);

//========== Клік на категорії ===========
refs.categories.addEventListener('click', event => {
  const categoryButton = event.target.closest('.categories__btn');
  if (!categoryButton) return;
  const selectedCategory = categoryButton.textContent.trim().toLowerCase();
  saveSelectedCategory(selectedCategory); // Зберігаємо вибрану категорію
  window.location.href = 'index.html'; // Переходимо на головну сторінку
});
