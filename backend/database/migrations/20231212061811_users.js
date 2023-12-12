/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('usr_firstname').notNullable();
        table.string('usr_lastname').notNullable();
        table.string('usr_mobile_number').notNullable();
        table.integer('usr_mobile_country_code').unsigned().references('id').inTable('countries');
        table.string('usr_password').notNullable();
        table.string('usr_email').notNullable();
        table.string('usr_designation').notNullable();
        table.integer('usr_company').unsigned().references('id').inTable('company');
        table.boolean('usr_tos_accepted').notNullable();
        table.boolean('usr_newsletter_accepted').notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
        table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('users');
};
