// Update with your config settings.
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

  development: {
    client: 'postgresql',
    connection: {
      host: '127.0.0.1',
      database: 'greensinternational',
      user:     'postgres',
      password: 'postgres',
    }
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


