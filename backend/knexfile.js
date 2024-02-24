// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      database: 'greens_international_server',
      user:     'postgres',
      password: '12345'
    },


    beforeCreate: (connection, callback) => {
      connection.query('CREATE EXTENSION IF NOT EXISTS pg_trgm', (err) => {
        callback(err, connection);
      });
    },
  },

  
  // development: {
  //   client: 'postgresql',
  //   connection: {
  //     host: 'localhost',
  //     database: 'greensin_revamp',
  //     user:     'greensin_knex',
  //     password: 'YUJ-(0ApmVRy'
  //   }
  // },
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};


