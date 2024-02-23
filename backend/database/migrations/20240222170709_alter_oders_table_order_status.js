/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.integer('ord_order_status').alter()
        table.integer('ord_order_status').unsigned().references('id').inTable('order_statuses');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.integer('ord_order_status').alter()
        table.integer('ord_order_status').unsigned().references('id').inTable('order_statuses');
    });
};
