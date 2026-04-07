import products from '../data/products.json';

export const allProducts = products;

export const getPrice = (product) => product.sale_price_gbp ?? product.price_gbp;

export const formatGbp = (value) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value || 0);

export const getCategories = () => [...new Set(allProducts.map((p) => p.category))];

export const getProductBySlug = (slug) => allProducts.find((product) => product.slug === slug);

export const getProductsByCategory = (category) => allProducts.filter((product) => product.category === category);
