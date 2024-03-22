/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_store_pickup_with_charge', (table) => {

        table.increments('store_pickup_with_charge_id').primary();
        table.boolean('store_pickup_with_charge_status').defaultTo(false);
        table.string('store_pickup_with_charge_label');
        table.integer('store_pickup_with_charge_cost');

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_store_pickup_with_charge');
};




