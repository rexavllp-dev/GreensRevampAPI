/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('product_inventory', (table) => {
        table.integer('min_qty');
        table.integer('max_qty');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('product_inventory', (table) => {
        table.dropColumn('min_qty');
        table.dropColumn('max_qty');
    });
};
