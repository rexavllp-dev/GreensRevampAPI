export const up = async (knex) => {
    await knex.schema.alterTable('variants', (table) => {
        table.dropColumn('product_id');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('variants', (table) => {
        table.integer('product_id').unsigned().references('id').inTable('products');
    });
  };