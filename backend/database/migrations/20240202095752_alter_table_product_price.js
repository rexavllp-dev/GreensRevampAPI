/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('products_price',(table) => {
        table.boolean('is_discount').defaultTo(false)   
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('products_price',(table) => {
      
        table.dropColumn('is_discount');
        
    });
};
