//Логіка сторінки Home
import refs from './js/refs';
import {
  getCategories,
  getHomeProducts,
  getProductsByCategory,
} from './js/products-api';
import {
  renderCategories,
  renderHomeProducts,
  renderPagination,
} from './js/render-function';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import {
  getSelectedCategory,
  getCurrentPage,
  resetCurrentPage,
} from './js/constants';

let currentProducts = []; // Змінна для зберігання товарів на головній сторінці

// Виклик функції для завантаження категорій та рендеру на головній сторінці
try {
  const categories = await getCategories();
  renderCategories(categories);
  // Збереження вибраної категорії в localStorage
  const selectedCategory = getSelectedCategory();
  const products =
    selectedCategory === 'all'
      ? await getHomeProducts()
      : await getProductsByCategory(selectedCategory);

  currentProducts = products; // Зберігаємо отримані товари в змінну
  renderHomeProducts(products);
  renderPagination(products.length, 6); // Рендер пагінації на основі кількості товарів
} catch (error) {
  iziToast.error({
    title: 'Error',
    message: 'Failed to fetch categories. Please try again later.',
    position: 'topRight',
  });
  console.error('Error fetching categories:', error);
}
window.addEventListener('paginationChange', () => {
  const products = window.currentProducts || [];
  renderHomeProducts(products);
  renderPagination(products.length);
});
