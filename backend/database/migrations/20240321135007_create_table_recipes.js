/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('recipes', (table) => {

        table.increments('recipe_id').primary();
        table.string('recipe_name')
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.text('recipe_description');
        table.boolean('recipe_status');
        table.string('recipe_image');
 
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
    return knex.schema.dropTable('recipes');
};