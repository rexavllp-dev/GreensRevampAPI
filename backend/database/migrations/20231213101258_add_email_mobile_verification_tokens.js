/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.string('email_verification_token');
        table.string('mobile_verification_token');
        table.boolean('email_verified');
        table.boolean('mobile_verified');

    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    await knex.schema.alterTable('users',  (table) => {
      
        table.dropColumn('email_verification_token');
        table.dropColumn('mobile_verification_token');
        table.dropColumn('email_verified');
        table.dropColumn('mobile_verified');

    });
};