
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.alterTable('users', (table) => {
        table.boolean('usr_marketing_email').defaultTo(false);
        table.boolean('usr_saving_email').defaultTo(false);
        table.boolean('usr_review_email').defaultTo(false);
        table.boolean('usr_customer_survey').defaultTo(false);
        table.boolean('usr_information_sharing').defaultTo(false);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export const down = async (knex) => {

    return knex.schema.alterTable('users', (table) => {
        table.dropColumn('usr_marketing_email');
        table.dropColumn('usr_saving_email');
        table.dropColumn('usr_review_email');
        table.dropColumn('usr_customer_survey');
        table.dropColumn('usr_information_sharing');
    });
};


