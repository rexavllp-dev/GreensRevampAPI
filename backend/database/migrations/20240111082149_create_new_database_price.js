/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('products_price', (table) => {
        table.increments('id').primary();
        table.decimal('product_price');
        table.decimal('special_price');
        table.enum('special_price_type', ['percentage', 'fixed', 'none']).defaultTo('none');
        table.dateTime('special_price_start');
        table.dateTime('special_price_end');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });

        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('products_price');
};