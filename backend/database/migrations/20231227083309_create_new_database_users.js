/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('usr_firstname');
        table.string('usr_lastname');
        table.string('usr_mobile_number').unique();
        table.integer('usr_mobile_country_code').unsigned().references('id').inTable('countries');
        table.string('usr_password');
        table.string('usr_email').unique();
        table.string('usr_designation');
        table.string('refresh_token').nullable();
        table.string('google_id').nullable();
        table.string('facebook_id').nullable();
        table.string('display_name').nullable();
        table.string('reset_token').nullable();
        table.string('reset_token_expires_at').nullable();
        table.integer('usr_company').unsigned().references('id').inTable('company');
        table.boolean('usr_tos_accepted');
        table.boolean('usr_newsletter_accepted');
        table.boolean('email_verified').defaultTo(false);
        table.boolean('mobile_verified').defaultTo(false);
        table.string('otp').nullable();
        table.timestamp('otp_expiry').nullable();
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });

    await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('users');
};
