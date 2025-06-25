//Константи

export const STORAGE_KEYS = {
  SELECTED_CATEGORY: 'selected_category',
  CURRENT_PAGE: 'current_page',
};
export const PRODUCTS_PER_PAGE = 12; // Кількість товарів на сторінці



// Функції для роботи з localStorage
// Збереження та отримання вибраної категорії та поточної сторінки

export function saveSelectedCategory(category) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_CATEGORY, category);
}

export function getSelectedCategory() {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORY) || 'all';
}

export function saveCurrentPage(page) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page.toString());
}

export function getCurrentPage() {
  return Number(localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE)) || 1;
}

export function resetCurrentPage() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
}