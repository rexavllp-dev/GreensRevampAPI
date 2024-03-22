/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.alterTable('product_reviews', (table) => {
        table.string('heading_review');
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.alterTable('product_reviews', (table) => {
        table.dropColumn('heading_review');
    });
};
