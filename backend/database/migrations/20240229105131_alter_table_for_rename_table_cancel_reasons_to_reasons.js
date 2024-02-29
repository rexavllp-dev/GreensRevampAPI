/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
    // Rename table if it exists
    await knex.schema.renameTable('cancel_reasons', 'reasons');

    // Add the new column
    await knex.schema.alterTable('reasons', (table) => {
        table.string('reason_type'); // Adding reason_type column
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    // Drop the new column
    await knex.schema.alterTable('reasons', (table) => {
        table.dropColumn('reason_type'); // Dropping reason_type column
    });

    // Rename table back to its original name
    await knex.schema.renameTable('reasons', 'cancel_reasons');
};
