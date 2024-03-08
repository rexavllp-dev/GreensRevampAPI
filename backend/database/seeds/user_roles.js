/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('user_roles').del()
  await knex('user_roles').insert([
    {id: 1, role_name: 'admin'},
    {id: 2, role_name: 'user'},
    {id: 3, role_name: 'warehouse'},
    {id: 4, role_name: 'picker'},
    {id: 5, role_name: 'qc'},
    {id: 6, role_name: 'delivery'},
  ]);
}
