/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    const columnExists = await knex.schema.hasColumn('homepage_banners', 'banner_type');
    if (!columnExists) {
        await knex.schema.alterTable('homepage_banners', (table) => {
            table.enum('banner_type', ["desktop", "mobile"]).defaultTo('desktop');
        });
    }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('homepage_banners', (table) => {
        table.dropColumn('banner_type');
    });
};
