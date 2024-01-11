export const up = async (knex) => {
    await knex.schema.createTable('categories', (table) => {
        table.increments('id').primary();
        table.integer('parent_id').references('id').inTable('categories');
        table.string('crt_logo');
        table.string('ctr_name');
        table.string('crt_description');
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