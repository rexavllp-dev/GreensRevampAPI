/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('company',  (table) => {
        // Drop the unique constraints during rollback
        table.unique(['company_trn_number']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('company',  (table) => {
        // Drop the unique constraints during rollback
        table.dropUnique(['company_trn_number']);
    });
};