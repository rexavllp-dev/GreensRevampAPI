/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('recipe_products', (table) => {

        table.increments('recipe_product_id').primary();
        table.integer('recipe_id').unsigned().references('recipe_id').inTable('recipes');
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('recipe_products');
};