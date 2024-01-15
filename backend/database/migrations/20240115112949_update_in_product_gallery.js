export const up = async (knex) => {
    await knex.schema.alterTable('product_gallery',  (table) => {
        table.integer('product_id').unsigned().references('id').inTable('products').alter();
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('product_gallery', (table) => {
        table.integer('product_id').unsigned().references('id').inTable('products').alter();
    });
};