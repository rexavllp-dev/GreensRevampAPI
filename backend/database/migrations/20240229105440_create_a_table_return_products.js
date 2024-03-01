/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    await knex.schema.createTable('return_products', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('order_item_id').unsigned().references('id').inTable('order_items');
        table.integer('reason_id').unsigned().references('id').inTable('reasons');
        table.text('return_comment');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    return knex.schema.dropTable('return_products');
};