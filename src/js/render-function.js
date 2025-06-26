//Функцію для створення, рендеру або видалення розмітки
import refs from './refs';
import iziToast from 'izitoast';
import {
  getHomeProducts,
  getProductsByCategory,
  getProductById,
} from './products-api';
import { getSelectedCategory, saveSelectedCategory } from './constants';

// ---- Функція для рендеру категорій
export function renderCategories(categories) {
  const selectedCategory = getSelectedCategory();
  // Якщо категорія не знайдена, встановлюємо "All" як вибрану категорію
  if (!categories.map(i => i.toLowerCase()).includes(selectedCategory)) {
    localStorage.setItem('selected_category', 'all');
  }
  const categoriesList = ['All', 'nobody', ...categories] // Додаємо "All" та "nobody" до списку категорій
    .map(category => {
      // Перевірка, чи є категорія вибраною
      const isActive =
        category.toLowerCase() === selectedCategory.toLowerCase()
          ? // Додаємо клас "categories__btn--active" для вибраної категорії
            'categories__btn--active'
          : '';
      // Повертаємо HTML розмітку для кожної категорії
      return `<li class="categories__item" data-category="${category.toLowerCase()}">
   <button class="categories__btn ${isActive}" type="button">${category}</button>
 </li>`;
    })
    .join('');
  refs.categories.innerHTML = categoriesList;
  refs.categories.addEventListener('click', onCategoryClick);
}

//---- Функція для рендеру товарів на головній сторінці
export function renderHomeProducts(products) {
  refs.products.innerHTML = ''; // Очищення попередніх товарів
  // Перевірка, чи є товари для рендеру
  if (!products || products.length === 0) {
    if (refs.notFoundBlock) {
      refs.notFoundBlock.classList.add('not-found--visible');
    }
    return; // Виходимо з функції, якщо немає товарів
  }
  // Якщо товари знайдені, видаляємо блок "not found"
  if (refs.notFoundBlock) {
    refs.notFoundBlock.classList.remove('not-found--visible');
  }
  const productsList = products
    .map(product => {
      const { id, title, brand, category, price, description, images } =
        product;
      // Перевірка наявності зображення, якщо немає, то використовуємо заміну
      const imageSrc = images?.[0] || 'https://via.placeholder.com/150';
      return `<li class="products__item" data-id="${id}">
    <img class="products__image" src="${imageSrc}" alt="${description}"/>
    <p class="products__title">${title}</p>
    <p class="products__brand"><span class="products__brand--bold">Brand:${brand}</span></p>
    <p class="products__category">Category:${category} </p>
    <p class="products__price">Price: ${price}</p>
 </li>`;
    })
    .join('');
  refs.products.insertAdjacentHTML('beforeend', productsList);
}

//----- Функція для обробки кліку на категорії
// Ця функція викликається при кліку на кнопку категорії
// Вона отримує назву категорії та викликає відповідну функцію для отримання товарів
async function onCategoryClick(event) {
  const categoryButton = event.target.closest('.categories__btn');
  if (!categoryButton) return;
  const allCategoryButtons =
    refs.categories.querySelectorAll('.categories__btn');
  allCategoryButtons.forEach(btn => {
    btn.classList.remove('categories__btn--active');
  });
  categoryButton.classList.add('categories__btn--active');
  const selectedCategory = categoryButton.textContent.trim().toLowerCase();
  // Збереження вибраної категорії в localStorage
  saveSelectedCategory(selectedCategory);

  try {
    const products =
      selectedCategory === 'all'
        ? await getHomeProducts()
        : await getProductsByCategory(selectedCategory);

    renderHomeProducts(products);
  } catch (error) {
    console.error(`Error fetching products for ${selectedCategory}:`, error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch products. Please try again later.',
      position: 'topRight',
    });
  }
}

//----- Функція для обробки кліку на товар
// Ця функція викликається при кліку на товар
export async function onItemClick(event) {
  const productItem = event.target.closest('.products__item');
  if (!productItem) return; // Якщо клік не по товару, виходим
  const productId = productItem.dataset.id; // Отримуємо ID товару з атрибуту data-id
  try {
    const product = await getProductById(productId);
    renderProductModal(product);
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch product details. Please try again later.',
      position: 'topRight',
    });
    console.error(`Error fetching product with ID ${productId}:`, error);
  }
}
// Функція для рендеру продукту в модальному вікні
function renderProductModal(product) {
  if (!refs.modalProduct) return;
  const {
    images,
    title,
    description,
    brand,
    category,
    price,
    shippingInformation,
    returnPolicy,
  } = product;
  refs.modalProduct.innerHTML = `
    <img class="modal-product__img" src="${
      images?.[0] || 'https://via.placeholder.com/150'
    }" alt="${title}" />
    <div class="modal-product__content">
      <p class="modal-product__title">${title}</p>
      <ul class="modal-product__tags">
        <li>Brand: ${brand}</li>
        <li>Category: ${category}</li>
      </ul>
      <p class="modal-product__description">${description}</p>
      <p class="modal-product__shipping-information">Shipping: ${
        shippingInformation || 'N/A'
      }</p>
      <p class="modal-product__return-policy">Return Policy: ${
        returnPolicy || 'N/A'
      }</p>
      <p class="modal-product__price">Price: $${price}</p>
      <button class="modal-product__buy-btn" type="button">Buy</button>
    </div>`;
  refs.modal.classList.add('modal--is-open');
  closeModal();
}

// Функція для закриття модального вікна
function closeModal() {
  refs.modal.addEventListener('click', event => {
    if (
      event.target === refs.modal ||
      event.target.classList.contains('modal-product__buy-btn')
    ) {
      resetModal(); // Закриваємо модальне вікно при кліку на фон або кнопку "Buy"
    }
  });
  // Додаємо обробник події для закриття модального вікна
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      resetModal(); // Закриваємо модальне вікно при натисканні клавіші Escape}
    }
  });
  refs.modalCloseBtn.addEventListener('click', resetModal); // Додаємо обробник для кнопки закриття
}

function resetModal() {
  refs.modal.classList.remove('modal--is-open');
  refs.modalProduct.innerHTML = ''; // Очищення модального вікна
  refs.modal.removeEventListener('click', closeModal);
}
