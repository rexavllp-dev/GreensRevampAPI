export const up = async (knex) => {
    await knex.schema.alterTable('price_history',  (table) => {
        table.dropColumn('price_id');
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('price_history',  (table) => {
        table.integer('price_id').unsigned().references('id').inTable('products_price');
    });
};