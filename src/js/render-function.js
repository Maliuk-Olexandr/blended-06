//Функцію для створення, рендеру або видалення розмітки
import refs from './refs';
import iziToast from 'izitoast';
import { getHomeProducts, getProductsByCategory } from './products-api';
import {
  getSelectedCategory,
  saveSelectedCategory,
  saveCurrentPage,
  getCurrentPage,
  resetCurrentPage,
  PRODUCTS_PER_PAGE,
} from './constants';

// ---- Функція для рендеру категорій
export function renderCategories(categories) {
  const selectedCategory = getSelectedCategory();
  // Якщо категорія не знайдена, встановлюємо "All" як вибрану категорію
  if (!categories.map(i=> i.toLowerCase).includes(selectedCategory)) {
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
  const currentPage = getCurrentPage();
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE; // Обчислюємо початковий індекс для пагінації
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  // Відрізаємо масив товарів відповідно до поточної сторінки
  const paginatedProducts = products.slice(startIndex, endIndex);

  const productsList = paginatedProducts
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
  const allCategoryButton =
    refs.categories.querySelectorAll('.categories__btn');
  allCategoryButton.forEach(btn => {
    btn.classList.remove('categories__btn--active');
  });
  categoryButton.classList.add('categories__btn--active');
  const selectedCategory = categoryButton.textContent.trim().toLowerCase();
  // Збереження вибраної категорії в localStorage
  saveSelectedCategory(selectedCategory);
  resetCurrentPage(); // Скидаємо поточну сторінку при зміні категорії

  try {
    const products =
      selectedCategory === 'all'
        ? await getHomeProducts()
        : await getProductsByCategory(selectedCategory);

    window.currentProducts = products; // Зберігаємо отримані товари в глобальну змінну

    renderHomeProducts(products);
    renderPagination(products.length, PRODUCTS_PER_PAGE); // Рендер пагінації на основі кількості товарів

    const paginationEvent = new CustomEvent('paginationChange', {
      detail: {
        page: 1, // Скидаємо на першу сторінку при зміні категорії
      },
    });
    window.dispatchEvent(paginationEvent); // Викликаємо подію для оновлення пагінації
  } catch (error) {
    console.error(`Error fetching products for ${selectedCategory}:`, error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch products. Please try again later.',
      position: 'topRight',
    });
  }
}

// Функція для рендера пагінації
export function renderPagination(totalItem, itemPerPage = PRODUCTS_PER_PAGE) {
  const currentPage = getCurrentPage();
  const totalPages = Math.ceil(totalItem / itemPerPage);
  refs.pagination.innerHTML = ''; // Очищення попередньої пагінації
  //   if (totalPages <= 1) {
  //     refs.pagination.classList.add('pagination--hidden');
  //     return; // Якщо сторінок менше або дорівнює 1, ховаємо пагінацію
  //   }
  //   refs.pagination.classList.remove('pagination--hidden');
  //   const paginationList = Array.from({ length: totalPages }, (_, index) => {
  //     const pageNumber = index + 1;
  //     const isActive = pageNumber === currentPage ? 'pagination__item--active' : '';
  //     return `<li class="pagination__item ${isActive}" data-page="${pageNumber}">
  //       <button class="pagination__btn" type="button">${pageNumber}</button>
  //     </li>`;
  //   }
  //   ).join('');
  //   refs.pagination.insertAdjacentHTML('beforeend', paginationList);
  //   refs.pagination.addEventListener('click', onPaginationClick);
  if (totalPages <= 1) {
    refs.pagination.innerHTML = '';
    return; // Якщо сторінок менше або дорівнює 1, ховаємо пагінацію
  }
  // Створюємо кнопки пагінації
  let buttonMarkup = '';
  // Додаємо кнопку для переходу на першу сторінку
  if (currentPage > 1) {
    buttonMarkup += `<button class="pagination__btn" type="button" data-page="${
      currentPage - 1
    }">Previous</button>`;
  }
  // Додаємо кнопки для кожної сторінки
  for (let i = 1; i <= totalPages; i++) {
    buttonMarkup += `<button class="pagination__btn ${
      i === currentPage ? 'pagination__btn--active' : ''
    }" type="button" data-page="${i}">${i}</button>`;
  }
  // Додаємо кнопку для переходу на наступну сторінку
  if (currentPage < totalPages) {
    buttonMarkup += `<button class="pagination__btn" type="button" data-page="${
      currentPage + 1
    }">Next</button>`;
  }
  refs.pagination.innerHTML = buttonMarkup; // Вставляємо кнопки пагінації в DOM
  refs.pagination.addEventListener('click', onPaginationClick);
}

function onPaginationClick(event) {
  const pageButton = event.target.closest('.pagination__btn');
  if (!pageButton) return;
  const selectedPage = Number(pageButton.dataset.page);
  saveCurrentPage(selectedPage); // Збереження поточної сторінки в localStorage
  // Оновлюємо товари на головній сторінці відповідно до вибраної сторінки
  const paginationEvent = new CustomEvent('paginationChange', {
    detail: {
      page: getCurrentPage(),
    },
  });
  window.dispatchEvent(paginationEvent); // Викликаємо подію для оновлення пагінації
}
