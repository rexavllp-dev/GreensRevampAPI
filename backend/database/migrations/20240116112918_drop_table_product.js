export const up = async (knex) => {
    await knex.schema.alterTable('products',  (table) => {
        table.dropColumn('prd_price');
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('products',  (table) => {
        table.integer('prd_price').unsigned().references('id').inTable('products_price')
    });
};