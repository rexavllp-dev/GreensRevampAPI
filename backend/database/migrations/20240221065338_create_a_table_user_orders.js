/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('user_orders', (table) => {
        table.increments('id').primary();
        table.integer('customer_id').unsigned().references('id').inTable('users').nullable();
        table.integer('address_id').unsigned().references('id').inTable('address').nullable();
        table.string('ord_customer_name');
        table.string('ord_customer_phone');
        table.string('ord_flat_villa').nullable();
        table.string('ord_customer_email');
        table.string('ord_note').nullable();
        table.string('ord_payment_method');
        table.string('ord_shipping_method');
        table.decimal('ord_sub_total');
        table.decimal('ord_discount').nullable();
        table.decimal('ord_service_charge').nullable();
        table.decimal('ord_shipping_cost').nullable();
        table.decimal('ord_tax').nullable();
        table.decimal('ord_grand_total');
        table.string('ord_order_status');
        table.boolean('ord_cash_received').nullable();
        table.string('ord_accepted_by').nullable();
        table.boolean('ord_picker_accepted_buy').nullable();
        table.boolean('ord_qc_confirmed').nullable();
        table.boolean('ord_package_verified').nullable();
        table.integer('ord_coupon_id').nullable();
        table.string('ord_delivery_accepted_by').nullable();
        table.string('ord_storepickup_accepted_by').nullable();
        table.boolean('ord_notify_delay').nullable();
        table.boolean('ord_notifyarrival').nullable();
        table.decimal('ord_amount_received').nullable();
        table.boolean('ord_return_pickup').nullable();
        table.string('ord_return_assign_to').nullable();
        table.string('ord_remarks').nullable();
        table.boolean('ord_contactless_delivery').nullable();
        table.string('ord_rv_number').nullable();

        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
        table.dateTime('deleted_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {
    return knex.schema.dropTable('user_orders');
};
