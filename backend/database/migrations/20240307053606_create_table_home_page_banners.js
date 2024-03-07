/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('homepage_banners', (table) => {
        table.increments('banner_id').primary();
        table.string('banner_caption');
        table.string('banner_image');
        table.string('banner_link');
        table.string('banner_link_text');
        table.enum('banner_location', ["Left", "Center", "Right"]);
        table.integer('banner_order');
        table.boolean('banner_type').defaultTo(true);
    
       
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('homepage_banners');
};