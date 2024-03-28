/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('recipe_categories', (table) => {

        table.increments('recipe_category_id').primary();
        table.integer('recipe_id').unsigned().references('recipe_id').inTable('recipes');
        table.string('recipe_category_name');
        
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    return knex.schema.dropTable('recipe_categories');
};