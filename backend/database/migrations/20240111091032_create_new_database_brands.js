export const up = async(knex) => {
    await knex.schema.createTable('brands', (table) => {
        table.increments('id').primary();
        table.string('brd_logo');
        table.string('brd_name');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      
       

    });

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('brands');
};