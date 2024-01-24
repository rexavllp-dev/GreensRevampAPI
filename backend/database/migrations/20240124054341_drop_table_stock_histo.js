// migrations/20240124053607_drop_table_stock_history.js

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = function (knex) {
    // Your migration logic to create the table
    return Promise.resolve();
  };
  
  /**
   * @param {import('knex').Knex} knex
   * @returns {Promise<void>}
   */
  export const down = function (knex) {
    // Your migration logic to drop the table
    return knex.schema.dropTableIfExists('stock_history');
  };