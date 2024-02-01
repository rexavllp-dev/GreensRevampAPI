/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('address', (table) => {
        table.increments('id').primary();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.string('address_title');
        table.string('full_name');
        table.string('address_line_1');
        table.string('delivery_remark');
        table.integer('mobile_number');
        table.integer('alt_mobile_number');
        table.boolean('is_default');
        table.string('latitude'); // Add latitude column
        table.string('longitude'); // Add longitude column
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('address');
};