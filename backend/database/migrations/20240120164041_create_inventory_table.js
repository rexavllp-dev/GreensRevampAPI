export const up = async (knex) => {
    await knex.schema.createTable('product_inventory', (table) => {
        table.increments('id').primary();
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.string('sku').unique();
        table.boolean('inventory_management');
        table.integer('product_quantity');
        table.enum('stock_availability', ['In stock', 'Out of stock']);
        table.boolean('show_out_of_stock_on_dashboard');
        table.boolean('back_in_stock');
        table.boolean('best_seller');
        table.integer('min_qty');
        table.integer('max_qty');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.schema.dropTable('product_inventory');
}
