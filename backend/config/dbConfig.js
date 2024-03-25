import knex from "knex";
import knexfile from "../knexfile.js";

const db = knex(knexfile['development']);

db.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm')
  .then(() => {
    console.log('pg_trgm extension installed');
    // After pg_trgm extension is installed, proceed to install fuzzystrmatch extension
    return db.raw('CREATE EXTENSION IF NOT EXISTS fuzzystrmatch');
  })
  .then(() => {
    console.log('fuzzystrmatch extension installed');
  })
  .catch((err) => {
    console.error('Error installing extensions:', err);
  })
  .finally(() => {
    db.destroy();
  });


export default knex(knexfile["development"]);


