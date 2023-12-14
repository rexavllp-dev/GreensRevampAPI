/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('company', (table) => {
        table.increments('id').primary();
        table.string('company_name').notNullable();
        table.string('company_landline').notNullable();
        table.integer('company_landline_country_code').unsigned().references('id').inTable('countries');
        table.string('company_vat_certificate').notNullable();
        table.string('company_trn_number',15).notNullable();
        table.string('company_trade_license').notNullable();
        table.date('company_trade_license_expiry').notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
        table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable();

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('company');
};
