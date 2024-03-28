
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

export async function seed(knex) {
    // Deletes ALL existing entries
    await knex('order_statuses').del().where({ id: 7 });
    await knex('order_statuses').insert([
        { id: 7, status_name: 'Payment Failed' },

    ]);

};
