/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('coupons', (table) => {
        table.float('coupon_min_amount').defaultTo(0)
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('coupons', (table) => {
        table.dropColumn('coupon_min_amount')
    });
};
