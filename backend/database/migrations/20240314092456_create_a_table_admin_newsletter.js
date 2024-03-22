/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_newsletter', (table) => {
        
        table.increments('newsletter_id').primary();
        table.boolean('newsletter_status').defaultTo(false);
        table.string('newsletter_mail_chimp_api_key');
        table.string('newsletter_mail_chimp_list_id');
  
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_newsletter');
};