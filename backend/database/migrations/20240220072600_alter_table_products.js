/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('products',(table) => {
        table.string('item_code');
        table.boolean('show_expiry_on_dashboard').defaultTo(false) ;  
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('products',(table) => {
      
        table.dropColumn('item_code');
        table.dropColumn('show_expiry_on_dashboard');
        
    });
};
