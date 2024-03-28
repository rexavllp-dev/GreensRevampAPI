
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *//**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export const up = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.integer('ord_replace_assign_to').unsigned().references('id').inTable('users');
        table.boolean('ord_replace_pickup').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.dropColumn('ord_replace_assign_to');
        table.dropColumn('ord_replace_pickup');
    });
};
