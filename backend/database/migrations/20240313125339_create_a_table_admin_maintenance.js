/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('admin_maintenance', (table) => {
        
        table.increments('maintenance_id').primary();
        table.boolean('maintenance_mode').defaultTo(false);
        table.text('allowed_ips');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('admin_maintenance');
};