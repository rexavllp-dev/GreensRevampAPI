export const up = async (knex) => {
    await knex.schema.alterTable('products_bulks', (table) => {
        table.dropColumn('discount');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('products_bulks', (table) => {
        table.decimal('discount');
    });
  };