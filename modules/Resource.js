let {Model} = require('./db.js');

class Resource extends Model {
    static get tableName() {
        return 'resource';
    }
}

module.exports = Resource;