/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('recipes', (table) => {
        table.dropColumn('deleted_at');
        table.integer('category_id').unsigned().references('id').inTable('categories');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.alterTable('recipes', (table) => {
        table.dropColumn('category_id');
    });
};
