/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('user_approval_status').del()
  await knex('user_approval_status').insert([
    {id: 1, status_name: 'Pending Approval'},
    {id: 2, status_name: 'Approved'},
    {id: 3, status_name: 'Rejected'},
    {id: 4, status_name: 'Active'},
    {id: 5, status_name: 'Inactive'}
  ]);
}
