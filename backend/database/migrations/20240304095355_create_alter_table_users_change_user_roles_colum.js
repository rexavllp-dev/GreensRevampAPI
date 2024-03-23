/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const up = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
        table.integer('is_role').unsigned().references('id').inTable('user_roles').alter();
    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
        table.integer('is_role').unsigned().references('id').inTable('user_roles').alter();
    });
};