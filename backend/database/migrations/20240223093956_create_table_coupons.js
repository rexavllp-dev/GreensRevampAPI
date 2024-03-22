
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const up = async (knex) => {
    await knex.schema.createTable('coupons', (table) => {
        table.increments('id').primary();
        table.string('coupon_code');
        table.text('coupon_notes');
        table.decimal('coupon_value');
        table.enum('coupon_discount_type', ['percentage', 'fixed']).defaultTo('fixed');
        table.enum('coupon_type', ['normal', 'refund',]).defaultTo('normal');
        table.dateTime('coupon_start_date');
        table.dateTime('coupon_end_date');
        table.boolean('coupon_status');
        table.boolean('is_free_shipping');


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
    return knex.schema.dropTable('coupons');
};
