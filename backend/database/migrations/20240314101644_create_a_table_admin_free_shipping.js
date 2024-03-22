/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_free_shipping', (table) => {

        table.increments('free_shipping_id').primary();
        table.boolean('free_shipping_status').defaultTo(false);
        table.integer('free_shipping_amount');


        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_free_shipping');
};