/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('company',(table) => {
        
        table.boolean('verification_status').defaultTo(false);
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('company',(table) => {
      
        table.dropColumn('verification_status');
        
    });
};