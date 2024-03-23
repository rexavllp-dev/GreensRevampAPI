/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *//**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('seasons', (table) => {
        table.dropColumn('season_homepage_status');
        table.renameColumn('season_active_status', 'season_status');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('seasons', (table) => {
        table.boolean('season_homepage_status').defaultTo(false);
        table.renameColumn('season_status', 'season_active_status');
    });
};