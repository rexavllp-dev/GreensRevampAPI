/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('category_discounts', (table) => {

        table.increments('category_discount_id').primary();
        table.integer('category_id').unsigned().references('id').inTable('categories');
        table.string('category_discount_name')
        table.boolean('category_discount_status');
        table.dateTime('category_discount_start_date');
        table.dateTime('category_discount_end_date');
        table.enum('category_discount_type', ['percentage'])
        table.float('category_discount_percentage_value');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('category_discounts');
};
