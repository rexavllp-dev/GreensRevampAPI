/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('products_bulks').del();
  await knex('products_languages').del();
  await knex('related_products').del();
  await knex('search_history').del();
  await knex('stock_history').del();
  await knex('variants').del();
  await knex('product_variants').del();
  await knex('product_seo').del();
  await knex('product_reviews').del();
  await knex('product_options').del();
  await knex('product_inventory').del();
  await knex('product_gallery').del();
  await knex('product_category').del();
  await knex('product_badge').del();
  await knex('price_history').del();
  await knex('products_price').del();
  await knex('options').del();
  await knex('bulk_above_max_orders').del();
  await knex('brand_seo').del();
  await knex('address').del();
  await knex('users').del();
  await knex('company').del();
  await knex('products').del();
  await knex('brands').del();
};
