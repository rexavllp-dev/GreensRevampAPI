export const up = async (knex) => {
    await knex.schema.alterTable('products',  (table) => {
        table.dropColumn('prd_brand_name');
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('products',  (table) => {
        table.integer('prd_brand_name').unsigned().references('id').inTable('brands')
    });
};