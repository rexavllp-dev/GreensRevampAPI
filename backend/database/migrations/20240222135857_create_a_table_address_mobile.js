/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.string('mobile_number').alter(); // Modify mobile_number column
        table.string('alt_mobile_number').alter();
        table.text('address_line_1').alter(); // Modify alt_mobile_number column
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('address', (table) => {
        table.string('mobile_number').alter(); // Revert mobile_number column
        table.string('alt_mobile_number').alter(); // Revert alt_mobile_number column
    });
};
