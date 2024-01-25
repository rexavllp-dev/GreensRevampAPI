/** 
 * @param { import("knex").Knex } knex 
 * @returns { Promise } 
 */ 
export const up = async (knex) => { 
    await knex.schema.alterTable('product_languages', (table) => { 
        table.integer('language_id').unsigned().references('id').inTable('languages'); 
    }); 
};

/** 
 * @param { import("knex").Knex } knex 
 * @returns { Promise } 
 */ 
export const down = async (knex) => { 
    return knex.schema.alterTable('product_languages', (table) => { 
        table.dropColumn('language'); 
    }); 
};