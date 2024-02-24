/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('products_price',(table) => {
        
        table.integer('product_id').unsigned().references('id').inTable('products')
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('products_price',(table) => {
      
        table.dropColumn('product_id');
        
    });
};
