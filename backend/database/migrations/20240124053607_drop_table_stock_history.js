/**
 * @param {import('knex').Knex} knex
 */
export const up = function (knex) {
    // This is intentionally left blank for the down migration
  };
  
  /**
   * @param {import('knex').Knex} knex
   */
  export const down = function (knex) {
    return knex.schema.dropTableIfExists('stock_history');
  };