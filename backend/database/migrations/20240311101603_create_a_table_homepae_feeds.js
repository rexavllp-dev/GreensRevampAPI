/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('feeds', (table) => {
        table.increments('feed_id').primary();
        table.string('feed_name');
        table.string('feed_image');
        table.boolean('feed_homepage_status').defaultTo(false);
        table.boolean('feed_active_status').defaultTo(false);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    return knex.schema.dropTable('feeds');
};