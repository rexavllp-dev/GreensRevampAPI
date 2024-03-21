/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('brand_discounts', (table) => {

        table.increments('brand_discount_id').primary();
        table.integer('brand_id').unsigned().references('id').inTable('brands');
        table.string('brand_discount_name')
        table.boolean('brand_discount_status');
        table.dateTime('brand_discount_start_date');
        table.dateTime('brand_discount_end_date');
        table.enum('brand_discount_type', ['percentage'])
        table.float('brand_discount_percentage_value');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('brand_discounts');
};
