/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.string('ord_zip_code').nullable();
        table.integer('ord_customer_country_code').unsigned().references('id').inTable('countries');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.dropColumn('ord_zip_code');
        table.dropColumn('ord_customer_country_code');
    });
};
