
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('address', (table) => {
        table.string('alternate_mobile_number');
        table.integer('alternate_country_code').unsigned().references('id').inTable('countries');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('address', (table) => {
        table.dropColumn('alternate_mobile_number');
        table.dropColumn('alternate_country_code');
    });
};
