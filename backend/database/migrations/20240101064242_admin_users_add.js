/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users',(table) => {
        
        table.string('is_role');
        table.boolean('is_status').defaultTo(false);
        table.string('notes');
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('users',(table) => {
      
        table.dropColumn('is_status');
        table.dropColumn('is_role');
        table.dropColumn('notes');
        
    });
};