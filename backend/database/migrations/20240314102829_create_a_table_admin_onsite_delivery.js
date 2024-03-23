/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_onsite_delivery', (table) => {

        table.increments('onsite_delivery_id').primary();
        table.boolean('onsite_delivery_status').defaultTo(false);
        table.string('onsite_delivery_label');
        table.integer('onsite_delivery_cost');

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_onsite_delivery');
};




