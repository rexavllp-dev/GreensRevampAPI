
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('order_statuses').del()
  await knex('order_statuses').insert([

    { id: 1, status_name: 'Pending' },
    { id: 2, status_name: 'Moved to QC' },
    { id: 3, status_name: 'Ready To Dispatch' },
    { id: 4, status_name: 'Out For Delivery' },
    { id: 5, status_name: 'Completed' },
    { id: 6, status_name: 'Canceled' }

  ]);

};
