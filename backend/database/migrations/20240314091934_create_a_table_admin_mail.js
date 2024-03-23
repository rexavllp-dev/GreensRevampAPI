/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_mail', (table) => {
        
        table.increments('mail_id').primary();
        table.string('mail_from_address');
        table.string('mail_from_name');
        table.string('mail_host');
        table.string('mail_port');
        table.string('mail_username');
        table.string('mail_password');
        table.enum('mail_encryption', ['ssl', 'tls',]);

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_mail');
};