export const up = async (knex) => {
    await knex.schema.alterTable('options', (table) => {
        table.dropColumn('product_id');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('options', (table) => {
        table.integer('product_id').unsigned().references('id').inTable('products');
    });
  };