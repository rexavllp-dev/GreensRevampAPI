import knex from "knex";
import knexfile from "../knexfile.js";
import knexSessionStore from 'connect-session-knex';



export default knex(knexfile["development"]);


