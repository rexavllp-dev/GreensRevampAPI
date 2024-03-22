/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.alterTable('menus', (table) => {
        table.string('menu_url');
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.alterTable('menus', (table) => {
        table.dropColumn('menu_url');
    });
};
