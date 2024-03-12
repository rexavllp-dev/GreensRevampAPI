/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('seasons', (table) => {
        table.increments('season_id').primary();
        table.string('season_name');
        table.string('season_image');
        table.boolean('season_homepage_status').defaultTo(false);
        table.boolean('season_active_status').defaultTo(false);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('seasons');
};