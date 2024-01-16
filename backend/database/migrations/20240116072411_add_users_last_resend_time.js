/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
        table.timestamp('last_resend_time');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
        table.dropColumn('last_resend_time');
    });
};