export function up(knex) {
    return knex.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm');
  }
  
  export function down(knex) {
    return knex.raw('DROP EXTENSION IF EXISTS pg_trgm');
  }
  