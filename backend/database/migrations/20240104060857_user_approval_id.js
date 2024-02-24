/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users',(table) => {
        
        table.integer('usr_approval_id').unsigned().references('id').inTable('user_approval_status');
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('users',(table) => {
      
        table.dropColumn('usr_approval_id');
        
    });
};