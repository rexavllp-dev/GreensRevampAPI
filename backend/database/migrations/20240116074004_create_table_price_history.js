/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('price_history', (table) => {
        table.increments('id').primary();
        table.integer('price_id').unsigned().references('id').inTable('products_price');
        table.string('product_price');
        table.string('special_price');
        table.string('special_price_type');
        table.dateTime('special_price_start');
        table.dateTime('special_price_end');
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });

        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('price_history');
};