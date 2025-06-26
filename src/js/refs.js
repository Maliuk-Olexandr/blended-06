//Обʼєкт з посиланнями на ДОМ елементи

const refs = {
  form: document.querySelector('.search-form'),
  categories: document.querySelector('.categories'),
  products: document.querySelector('.products'),
  notFoundBlock: document.querySelector('.not-found'),
  modal: document.querySelector('.modal'),
  modalProduct: document.querySelector('.modal-product'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
};

export default refs;

// refs.form - форма пошуку
// refs.categories - категорії
// refs.loadMoreBtn - кнопка "Завантажити більше"
// refs.homeLink - посилання на домашню сторінку
// refs.products - товари
// refs.notFoundBlock - блок, який показується, якщо товари не знайдено
// refs.pagination - пагінація для навігації між сторінками товарів
