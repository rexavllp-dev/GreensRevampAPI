export const up = async (knex) => {
    await knex.schema.alterTable('product_stock_history', (table) => {
        table.dropColumn('sku');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('product_stock_history', (table) => {
        table.string('sku');
    });
  };