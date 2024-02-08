/**
* @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('products',(table) => {
        
        table.string('use_and_care', 5000).defaultTo('');
        table.string('shipping_and_returns', 5000).defaultTo('');
        table.string('dimensions_and_more_info', 5000).defaultTo('');
        table.string('ein_code');
        table.string('prd_description', 5000).defaultTo('').alter();
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.alterTable('products',(table) => {
      
        table.dropColumn('dimensions_and_more_info');
        table.dropColumn('use_and_care');
        table.dropColumn('ein_code');
        table.dropColumn('shipping_and_returns');
        table.dropColumn('prd_description');
    });
};