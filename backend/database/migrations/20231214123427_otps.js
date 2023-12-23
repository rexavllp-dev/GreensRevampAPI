/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async(knex) => {
    await knex.schema.createTable('otps', (table) => {
        table.increments('id').primary();
        table.string('otp').notNullable();
        table.integer('user_id').unsigned().references('id').inTable('users');
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable();
        table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable();

    });

    await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON otps
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
        
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('otps');
};
