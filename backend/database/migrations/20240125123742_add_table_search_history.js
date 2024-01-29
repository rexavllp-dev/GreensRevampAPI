/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('search_history', (table) => {
        table.increments('id').primary();
        table.string('search_keyword');
        table.string('prd_lan_desc');
        table.dateTime('searched_at').defaultTo(knex.fn.now());
        
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('search_history');
};