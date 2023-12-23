/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('countries',(table) => {
      
        table.string('country_dial_code').nullable();
       
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('countries',(table) => {
      
        table.dropColumn('country_dial_code').nullable();
        
    });
};
