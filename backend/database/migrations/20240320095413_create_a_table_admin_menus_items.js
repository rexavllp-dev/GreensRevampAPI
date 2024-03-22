/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('menus', (table) => {

        table.increments('menu_id').primary();
        table.string('menu_name');
        table.boolean('menu_status').defaultTo(false);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('menus');
};
