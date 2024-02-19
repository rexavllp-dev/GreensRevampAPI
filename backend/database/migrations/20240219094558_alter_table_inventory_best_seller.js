/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('product_inventory', (table) => {
        table.boolean('best_seller').defaultTo(false).alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    return knex.schema.alterTable('product_inventory', (table) => {
        table.boolean('best_seller').alter();
    });
};