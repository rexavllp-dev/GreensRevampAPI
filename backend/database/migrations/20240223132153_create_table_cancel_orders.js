
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('cancel_orders', (table) => {
        table.increments('id').primary();
        table.integer('order_id').unsigned().references('id').inTable('user_orders');
        table.integer('cancel_reason_id').unsigned().references('id').inTable('cancel_reasons');
        table.string('cancel_note');
        table.enum('cancel_type', ["full", "partial"]);
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('cancel_orders');
};

