/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('order_products', (table) => {
        if (!knex.schema.hasColumn('order_products', 'op_actual_price')) {
            table.decimal('op_actual_price');
        }
        if (!knex.schema.hasColumn('order_products', 'op_unit_price')) {
            table.decimal('op_unit_price');
        }
        if (!knex.schema.hasColumn('order_products', 'op_qty')) {
            table.integer('op_qty');
        }
        if (!knex.schema.hasColumn('order_products', 'op_line_total')) {
            table.decimal('op_line_total');
        }
        if (!knex.schema.hasColumn('order_products', 'op_is_return')) {
            table.boolean('op_is_return');
        }
        if (!knex.schema.hasColumn('order_products', 'op_is_cancel')) {
            table.boolean('op_is_cancel').defaultTo(false);
        }
        if (!knex.schema.hasColumn('order_products', 'op_refund_type')) {
            table.string('op_refund_type');
        }
        if (!knex.schema.hasColumn('order_products', 'op_return_assigned_to')) {
            table.integer('op_return_assigned_to');
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('order_products', (table) => {
        table.dropColumn('op_actual_price');
        table.dropColumn('op_unit_price');
        table.dropColumn('op_qty');
        table.dropColumn('op_line_total');
        table.dropColumn('op_is_return');
        table.dropColumn('op_is_cancel');
        table.dropColumn('op_refund_type');
        table.dropColumn('op_return_assigned_to');
    });
};
