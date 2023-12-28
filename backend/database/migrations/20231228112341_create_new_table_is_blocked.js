/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.boolean('is_blocked').defaultTo(false);
        

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.dropColumn('is_blocked');
        

    });
};