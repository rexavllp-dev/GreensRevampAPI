/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Deletes ALL existing entries
  await knex('vat').del()
  await knex('vat').insert([
    {id: 1, vat: 5}
  ]);
};
