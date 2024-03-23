
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
    await knex.schema.alterTable('order_items', (table) => {
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    return knex.schema.alterTable('order_items', (table) => {
        table.dropColumn('created_at');
        table.dropColumn('updated_at');
    });
};
