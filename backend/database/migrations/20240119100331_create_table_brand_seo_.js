/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('brand_seo', (table) => {
        table.increments('id').primary();
        table.integer('brand_id').unsigned().references('id').inTable('brands');
        table.string('meta_title');
        table.string('meta_description');
        table.string('meta_script');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });

        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('brands');
};