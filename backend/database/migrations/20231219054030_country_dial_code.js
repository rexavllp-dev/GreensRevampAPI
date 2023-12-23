/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('company',  (table) => {
      
        table.string('company_dial_code').nullable();
       
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('company',  (table) => {
      
        table.dropColumn('company_dial_code').nullable();
        
    });
};
 return ;
