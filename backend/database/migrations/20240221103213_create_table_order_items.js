
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
    await knex.schema.createTable('order_items', (table) => {
        table.increments('id').primary();
        table.integer('order_id').unsigned().references('id').inTable('user_orders');
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.decimal('op_actual_price');
        table.decimal('op_unit_price');
        table.integer('op_qty');
        table.decimal('op_line_total');
        table.boolean('op_is_return');
        table.boolean('op_is_cancel').defaultTo(false);
        table.string('op_refund_type');
        table.integer('op_return_assigned_to');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export const down = async (knex) => {
    return knex.schema.dropTable('order_items');
};
