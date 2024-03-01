/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.renameColumn('usr_email', 'address_email');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.renameColumn('address_email', 'usr_email');
    });
};
