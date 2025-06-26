import axios from "axios";

const currentPage = 1;


// Функції для роботи з бекендом
// Отримання категорій
export async function getCategories() {
  const response = await axios('https://dummyjson.com/products/category-list');
  return response.data;
}
// Отримання товарів для головної сторінки
// Параметри: currentPage - номер сторінки, limit - кількість товарів на сторінці
export async function getHomeProducts() {
  const url = `https://dummyjson.com/products?limit=12&skip=${(currentPage - 1) * 12}`;
  const response = await axios(url);
  return response.data.products;
}

// Отримання товарів за категорією
// Параметри: category - назва категорії, currentPage - номер сторінки, limit - кількість товарів на сторінці
export async function getProductsByCategory(category) {
  if (category === 'all') {
    return getHomeProducts(); // Якщо категорія "всі", повертаємо всі товари
  } 
  // Формуємо URL для отримання товарів за категорією
  const url = `https://dummyjson.com/products/category/${category}?limit=12&skip=${(currentPage - 1) * 12}`;
  const response = await axios(url);
  return response.data.products;
}
// Отримання товару за ID
// Параметри: id - ID товару
export async function getProductById(id) {
  const url = `https://dummyjson.com/products/${id}`;
  const response = await axios(url);
  return response.data;
}