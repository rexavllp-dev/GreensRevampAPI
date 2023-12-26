/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('company', (table) => {
        table.increments('id').primary();
        table.string('company_name');
        table.string('company_landline');
        table.integer('company_landline_country_code').unsigned().references('id').inTable('countries');
        table.string('company_vat_certificate');
        table.string('company_trn_number',15).unique();
        table.string('company_trade_license');
        table.date('company_trade_license_expiry');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });

    await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON company
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('company');
};