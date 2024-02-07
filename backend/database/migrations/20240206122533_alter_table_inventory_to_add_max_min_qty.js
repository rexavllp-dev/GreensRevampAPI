/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.table('product_inventory', (table) => {
        table.integer('min_qty').nullable();
        table.integer('max_qty').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.table('product_inventory', (table) => {
        table.dropColumn('min_qty');
        table.dropColumn('max_qty');
    });
};