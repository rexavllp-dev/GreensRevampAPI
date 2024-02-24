/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export  const up = async (knex) => {
    return knex.raw(`
        CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER
        LANGUAGE plpgsql
        AS
        $$
        BEGIN
            NEW.updated_at = CURRENT_TIMESTAMP;
            RETURN NEW;
        END;
        $$;
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    return knex.raw(`
      DROP FUNCTION IF EXISTS update_timestamp() CASCADE;
    `);
};