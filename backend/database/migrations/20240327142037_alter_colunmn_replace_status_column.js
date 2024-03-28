

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *//**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export const up = async (knex) => {
    await knex.schema.alterTable('replace_statuses', (table) => {
        table.renameColumn('status_name','replace_status_name');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('replace_statuses', (table) => {
        table.renameColumn('replace_status_name', 'status_name');
    });
};