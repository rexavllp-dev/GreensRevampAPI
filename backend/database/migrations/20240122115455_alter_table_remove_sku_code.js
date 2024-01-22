export const up = async (knex) => {
    await knex.schema.alterTable('products', (table) => {
        table.dropColumn('sku_code');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('products', (table) => {
        table.string('sku_code');
    });
  };