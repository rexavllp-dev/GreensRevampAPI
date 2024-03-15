export const up = async (knex) => {
    await knex.schema.createTable('admin_store', (table) => {
        table.increments('ad_store_id').primary();
        table.string('ad_store_name');
        table.string('ad_store_tagline');
        table.string('ad_store_phone');
        table.string('ad_store_room');
        table.string('ad_store_email');
        table.string('ad_store_address_1');
        table.string('ad_store_address_2');
        table.string('ad_store_city');
        table.integer('ad_store_country').unsigned().references('id').inTable('countries');
        table.string('ad_store_state');
        table.string('ad_store_zip');
        table.string('ad_customer_care_phone');
        table.string('ad_customer_care_email');

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_store');
};