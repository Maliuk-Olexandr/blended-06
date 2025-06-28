
// Функції для роботи з localStorage
// Збереження та отримання вибраної категорії та поточної сторінки
import { STORAGE_KEYS } from './constants';


//========= Category and Page functions ==========
//зберігає вибрану категорію в localStorage (ключ selected_category)
export function saveSelectedCategory(category) {
  localStorage.setItem(STORAGE_KEYS.SELECTED_CATEGORY, category);
}
//отримує вибрану категорію з localStorage (ключ selected_category)
//якщо категорія не вибрана, повертає 'all'
export function getSelectedCategory() {
  return localStorage.getItem(STORAGE_KEYS.SELECTED_CATEGORY) || 'all';
}
//очищує вибрану категорію в localStorage (ключ selected_category)
export function resetSelectedCategory() {
  localStorage.removeItem(STORAGE_KEYS.SELECTED_CATEGORY);
}
//зберігає поточну сторінку в localStorage (ключ current_page)
//якщо сторінка не вказана, зберігає 1
export function saveCurrentPage(page) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_PAGE, page.toString());
}
//отримує поточну сторінку з localStorage (ключ current_page)
export function getCurrentPage() {
  return Number(localStorage.getItem(STORAGE_KEYS.CURRENT_PAGE)) || 1;
}
//очищує поточну сторінку в localStorage (ключ current_page)
export function resetCurrentPage() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_PAGE);
}


//========= Wishlist functions ==========
//отримує масив ID продуктів з localStorage (ключ wishlist)
export function getWishlist() {
  const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST);
  
  return wishlist ? JSON.parse(wishlist) : [];
}

//додає ID продукту до масиву і записує в localStorage (ключ wishlist)
export function addToWishlist(productId) {
  const wishlist = getWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  }
}

//очищує масив ID продуктів в localStorage (ключ wishlist)
export function clearWishlist() {
  localStorage.removeItem(STORAGE_KEYS.WISHLIST);
}

//видаляє ID продукту з масиву і записує в localStorage (ключ wishlist)
export function removeFromWishlist(productId) {
  const wishlist = getWishlist();
  const updatedWishlist = wishlist.filter(id => id !== productId);
  localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updatedWishlist));
}

//перевіряє чи є ID продукту в масиві ID продуктів в localStorage (ключ wishlist)
export function isProductInWishlist(productId) {
  const wishlist = getWishlist();
  return wishlist.includes(productId);
}


