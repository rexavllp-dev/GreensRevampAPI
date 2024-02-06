/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('bulk_above_max_orders', (table) => {
        table.dropColumn('approved_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('bulk_above_max_orders', (table) => {
       
        table.boolean('approved_status').defaultTo(false);
    });
};
