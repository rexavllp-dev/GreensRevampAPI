/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('product_variants', (table) => {
        table.integer('variant_id').unsigned().references('id').inTable('products');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('product_variants', (table) => {
        table.dropColumn('variant_id');
    });
};