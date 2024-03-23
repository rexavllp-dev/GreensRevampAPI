/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('homepage_brand', (table) => {
        table.increments('homepage_brand_id').primary();
        table.integer('brand_id').unsigned().references('id').inTable('brands');
        
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    return knex.schema.dropTable('homepage_brand');
};