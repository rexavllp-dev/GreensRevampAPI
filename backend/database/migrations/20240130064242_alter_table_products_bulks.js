/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.alterTable('products_bulks', (table) => {
        table.integer('start_range').alter();
        table.integer('end_range').alter();
        table.decimal('discounted_price');
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('products_bulks', (table) => {
        table.decimal('start_range').alter();
        table.decimal('end_range').alter();
        table.dropColumn('discounted_price');
    });
};