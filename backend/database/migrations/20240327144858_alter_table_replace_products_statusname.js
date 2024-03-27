
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *//**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 export const up = async (knex) => {
    await knex.schema.alterTable('replace_products', (table) => {
        table.integer('replace_status').unsigned().references('id').inTable('replace_statuses');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('replace_products', (table) => {
        table.dropColumn('replace_status');
    });
};
