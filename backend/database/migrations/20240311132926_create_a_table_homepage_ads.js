/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('homepage_ads', (table) => {
        table.increments('ads_id').primary();
        table.string('ads_name');
        table.string('ads_image');
        table.string('ads_link');
        table.string('ads_link_text');
        table.boolean('ads_homepage_status').defaultTo(false);
        table.boolean('ads_active_status').defaultTo(false);
        table.boolean('ads_position').defaultTo(true);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    return knex.schema.dropTable('homepage_ads');
};