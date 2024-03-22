/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('user_orders', (table) => {
        table.integer('ord_picker_accepted_by').unsigned().references('id').inTable('users').alter();
        table.integer('ord_accepted_by').unsigned().references('id').inTable('users').alter();
        table.integer('ord_delivery_accepted_by').unsigned().references('id').inTable('users').alter();
        table.integer('ord_storepickup_accepted_by').unsigned().references('id').inTable('users').alter();
        table.integer('ord_return_assign_to').unsigned().references('id').inTable('users').alter();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('user_orders', (table) => {
        table.boolean('ord_picker_accepted_by').alter();
        table.string('ord_accepted_by').alter();
        table.string('ord_delivery_accepted_by').alter();
        table.string('ord_storepickup_accepted_by').alter();
        table.string('ord_return_assign_to').alter();
    });
};