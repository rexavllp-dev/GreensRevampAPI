/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.dropTable('order_products');
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.createTable('order_products', (table) => {
        table.increments('id').primary();
        table.integer('order_id').unsigned().references('id').inTable('orders');
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(knex.fn.now());
    });
}