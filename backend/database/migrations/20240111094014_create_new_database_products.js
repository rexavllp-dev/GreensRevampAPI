/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    await knex.schema.createTable('products', (table) => {
        table.increments('id').primary();
        table.string('prd_name');
        table.string('prd_discription');
        table.enum('prd_storage_type', ['Forzen', 'Dry', 'Chilled', 'please select']).defaultTo('please select');
        table.enum('prd_tax_class', ['vat5%'])
        table.string('prd_tags');
        table.dateTime('prd_expiry_date');
        table.boolean('prd_dashboard_status');
        table.boolean('prd_status');
        table.string('prd_sales_unit');
        table.enum('prd_Re', ["Returnable", "Non Returnable"]).defaultTo('Non Returnable');
        table.integer('prd_brandname').unsigned().references('id').inTable('brands')
        table.integer('prd_price').unsigned().references('id').inTable('products_price')
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

  

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('products');
};
