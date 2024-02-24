export const up = async (knex) => {
    await knex.schema.alterTable('product_variants', (table) => {
        table.dropColumn('variant_label');
        table.dropColumn('variant_id');
    });
  };
  
  export const down = async (knex) => {
    return knex.schema.alterTable('product_variants', (table) => {
        table.string('variant_label');
        table.integer('variant_id');
    });
  };