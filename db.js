/**
* Wallet Model
* 1.  A wallet belongs to only one user.
* 2.  A wallet contains balance, id.
* 3.  A user can have many wallets.
**/

const { Model } = require('objection');
const Knex = require('knex');

const knex = Knex({
  client: 'mysql2',
  useNullAsDefault: true,
  connection: {
    host: 'localhost',
    port: 3307,
    user: 'dev',
    password: 'password',
    database: 'wallet_service'
  }
});

Model.knex(knex);

class Wallet extends Model {
  static get tableName() {
    return 'wallets';
  }

  static get idColumn() {
    return 'id';
  }
}

module.exports = {
  Wallet
}
