/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.integer('zip_code').nullable();
        table.string('contactless_delivery').nullable();
        table.string('address_line_2').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.dropColumn('zip_code');
        table.dropColumn('contactless_delivery');
        table.dropColumn('address_line_2').nullable();
    });
};
