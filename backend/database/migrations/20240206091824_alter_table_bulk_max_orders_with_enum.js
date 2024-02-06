/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('bulk_above_max_orders', (table) => {
        table.enum('approved_status', ["Pending", "Accept", "Reject"]).defaultTo("Pending");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('bulk_above_max_orders', (table) => {
        table.dropColumn('approved_status');
    });
};
