//Логіка сторінки Home
import refs from './js/refs';
import {
  getCategories,
  getHomeProducts,
  getProductsByCategory,
  getProductsBySearch
} from './js/products-api';
import {
  renderCategories,
  renderHomeProducts,
  onItemClick,
  searchProducts,
} from './js/render-function';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import { getSelectedCategory } from './js/constants';

// ======= Завантаження категорій і товарів =========
try {
  const categories = await getCategories();
  renderCategories(categories);

  const selectedCategory = getSelectedCategory();

  const products =
    selectedCategory === 'all'
      ? await getHomeProducts()
      : await getProductsByCategory(selectedCategory);

  renderHomeProducts(products);
} catch (error) {
  iziToast.error({
    title: 'Error',
    message: 'Failed to fetch categories or products. Please try again later.',
    position: 'topRight',
  });
  console.error('Error fetching categories or products:', error);
}

// ========== Делегування кліку на картки товарів ===========
refs.products.addEventListener('click', onItemClick);

// ========== Пошук товару ===========
refs.searchForm.addEventListener('submit', searchProducts);