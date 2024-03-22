
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {

    await knex.schema.createTable('privacy_policies', (table) => {
        table.increments('id').primary();
        table.text('prv_description');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    return knex.schema.dropTable('privacy_policies');
};