/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('user_approval_status', (table) => {
        table.increments('id').primary();
        table.string('status_name');
        table.dateTime('created_at').defaultTo(knex.fn.now());
        table.dateTime('updated_at').defaultTo(knex.fn.now());


    });

    await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON user_approval_status
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('user_approval_status');
};