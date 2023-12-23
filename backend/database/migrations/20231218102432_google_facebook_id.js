/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.string('google_id').nullable();
        table.string('facebook_id').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.dropColumn('google_id').nullable();
        table.dropColumn('facebook_id').nullable();
    });
};

