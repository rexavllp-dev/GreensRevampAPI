/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('price_history',(table) => {
        
        table.integer('product_price_id').unsigned().references('id').inTable('products_price');
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('price_history',(table) => {
      
        table.dropColumn('product_price_id');
        
    });
};
