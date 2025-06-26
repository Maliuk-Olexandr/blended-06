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
  onItemClick,
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


// 4. Реалізуй делегування на списку ul.products
// при кліку в картку продукту потрібно прочитати попередньо записаний ID на тезі li
// зробити запит по ендпоінту №3, відкрити модальне вікно і відрендерити в div.modal-product отриманий продукт.
// шаблон продукту
// <img class="modal-product__img" src="" alt="" />
//       <div class="modal-product__content">
//         <p class="modal-product__title"></p>
//         <ul class="modal-product__tags"></ul>
//         <p class="modal-product__description"></p>
//         <p class="modal-product__shipping-information">Shipping:</p>
//         <p class="modal-product__return-policy">Return Policy:</p>
//         <p class="modal-product__price">Price: $</p>
//         <button class="modal-product__buy-btn" type="button">Buy</button>
//       </div>

// модальне вікно відкривається додавання до div.modal класу modal--is-open і закривається зняттям цього класу з div.modal

 // Додаємо обробник події для закриття модального вікна
 