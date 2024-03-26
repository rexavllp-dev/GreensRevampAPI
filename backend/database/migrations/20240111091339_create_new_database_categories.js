export const up = async (knex) => {
    await knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.integer('cat_parent_id');
        table.string('cat_logo');
        table.string('cat_name');
        table.string('cat_description');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());


    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('categories');
};