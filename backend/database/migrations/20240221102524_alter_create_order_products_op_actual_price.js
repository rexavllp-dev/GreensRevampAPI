/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('order_products', (table) => {
       
            table.decimal('op_actual_price');
        
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('order_products', (table) => {
        table.dropColumn('op_actual_price');
      
    });
};
