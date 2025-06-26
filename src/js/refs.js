//Обʼєкт з посиланнями на ДОМ елементи

import { searchProducts } from "./render-function";

const refs = {
  form: document.querySelector('.search-form'),
  categories: document.querySelector('.categories'),
  products: document.querySelector('.products'),
  notFoundBlock: document.querySelector('.not-found'),
  modal: document.querySelector('.modal'),
  modalProduct: document.querySelector('.modal-product'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  searchForm: document.querySelector('.search-form'),
  searchFormClearBtn: document.querySelector('.search-form__btn-clear'),
};

export default refs;

// refs.form - форма пошуку
// refs.categories - категорії
// refs.loadMoreBtn - кнопка "Завантажити більше"
// refs.homeLink - посилання на домашню сторінку
// refs.products - товари
// refs.notFoundBlock - блок, який показується, якщо товари не знайдено
// refs.pagination - пагінація для навігації між сторінками товарів
// refs.modal - модальне вікно для перегляду товару
// refs.modalProduct - товар у модальному вікні
// refs.modalCloseBtn - кнопка закриття модального вікна
// refs.searchForm - форма пошуку товарів
// refs.searchFormClearBtn - кнопка очищення форми пошуку
