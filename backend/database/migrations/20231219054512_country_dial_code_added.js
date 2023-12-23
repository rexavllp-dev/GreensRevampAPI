/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('countries',(table) => {
      
        table.string('company_dial_code').nullable();
       
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('countries',(table) => {
      
        table.dropColumn('company_dial_code').nullable();
        
    });
};
