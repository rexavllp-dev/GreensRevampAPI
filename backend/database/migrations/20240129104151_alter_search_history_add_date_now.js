/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('search_history', (table) => {
        table.timestamp('searched_at').defaultTo(knex.fn.now()).alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('search_history', (table) => {
        table.timestamp('searched_at').alter();
    });
};