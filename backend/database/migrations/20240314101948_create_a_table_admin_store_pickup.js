/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_store_pickup', (table) => {

        table.increments('store_pickup_id').primary();
        table.string('store_pickup_label');
        table.boolean('store_pickup_status').defaultTo(false);
        table.integer('store_pickup_cost');
        table.integer('store_pickup_charge');


        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_store_pickup');
};