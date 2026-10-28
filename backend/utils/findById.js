const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Like Model.findByPk, but a malformed id gives null instead of a database error. */
const findById = (Model, id) => (UUID.test(String(id)) ? Model.findByPk(id) : Promise.resolve(null));

module.exports = { findById, UUID };
