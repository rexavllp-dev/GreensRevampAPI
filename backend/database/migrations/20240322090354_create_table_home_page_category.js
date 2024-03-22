/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('homepage_category', (table) => {
        table.increments('homepage_category_id').primary();
        table.integer('category_id').unsigned().references('id').inTable('categories');
        
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    return knex.schema.dropTable('homepage_category');
};