/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.alterTable('vat', (table) => {
       
        table.float('vat').defaultTo(5).alter(); // Add VAT percentage column.alter();
    });  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('vat', (table) => {
        table.float('vat').alter(); 
        
    });
};