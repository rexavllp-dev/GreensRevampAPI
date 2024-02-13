/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.table('product_inventory', (table) => {
       table.dateTime('back_in_stock_end_date').nullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    await knex.schema.table('product_inventory', (table) => {
        table.dropColumn('back_in_stock_end_date');
        
    });
};