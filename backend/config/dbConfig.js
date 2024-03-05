import knex from "knex";
import knexfile from "../knexfile.js";

const db = knex(knexfile['development']);

db.raw('CREATE EXTENSION IF NOT EXISTS pg_trgm')
  .then(() => {
    console.log('pg_trgm extension installed');
  })
  .catch((err) => {
    console.error('Error installing pg_trgm extension:', err);
  })
  .finally(() => {
    db.destroy();
  });


export default knex(knexfile["development"]);


