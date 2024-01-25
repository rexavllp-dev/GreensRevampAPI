/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('products_languages', (table) => {
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.integer('language_id').unsigned().references('id').inTable('languages');
        table.string('prd_lan_name');
        table.string('prd_lan_desc');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('products_languages');
};