const db = require('../../data/db-config');

function find() {
  return db('users').select('id', 'username').orderBy('id');
}

/**
  resolves to an ARRAY with all users that match the filter condition
 */
function findBy(filter) {
  return db('users').where(filter).orderBy('id');
}

/**
  resolves to the user { user_id, username } with the given user_id
 */
function findById(user_id) {}

/**
  resolves to the newly inserted user { user_id, username }
 */
function add(user) {}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
