/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('replace_products', (table) => {
        table.integer('order_id').unsigned().references('id').inTable('user_orders');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('replace_products', (table) => {
        table.dropColumn('order_id');
    });
};


