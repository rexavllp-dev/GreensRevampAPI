export const up = async(knex) => {
    await knex.schema.createTable('product_category', (table) => {
        table.increments('id').primary();
        table.integer('product_id').references('id').inTable('products');
        table.integer('category_id').references('id').inTable('categories');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
       

    });

  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('product_category');
};