export const up = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
        table.string('otp').nullable().alter();
    });
};
/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/
export const down = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
        table.time('otp').nullable().alter();
    });
};