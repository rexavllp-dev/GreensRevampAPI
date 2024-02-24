/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('orders', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.integer('address_id').unsigned().references('id').inTable('address');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(knex.fn.now());
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('orders');
};

