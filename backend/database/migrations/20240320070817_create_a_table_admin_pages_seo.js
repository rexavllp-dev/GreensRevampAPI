/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const up = async (knex) => {
    await knex.schema.createTable('pages_seo', (table) => {

        table.increments('page_seo_id').primary();
        table.integer('page_id').unsigned().references('page_id').inTable('pages');
        table.string('page_seo_url');
        table.string('page_seo_meta_title');
        table.text('page_seo_meta_description');
        table.text('page_seo_meta_scripts');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());

    });
};


/**
* @param { import("knex").Knex } knex
* @returns { Promise<void> }
*/

export const down = async (knex) => {
    return knex.schema.dropTable('pages_seo');
};


