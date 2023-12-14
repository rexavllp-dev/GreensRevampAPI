/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('countries', (table) => {
        table.increments('id').primary();
        table.string('country_code').notNullable();
        table.string('country_name').notNullable();
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
        table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable();

    });

    await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON countries
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('countries');
};
