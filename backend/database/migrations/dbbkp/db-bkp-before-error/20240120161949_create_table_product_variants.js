/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('product_variants', (table) => {
        table.increments('id').primary();
        table.integer('variant_id').unsigned().references('id').inTable('variants');
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.string('variant_label');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('product_variants');
};