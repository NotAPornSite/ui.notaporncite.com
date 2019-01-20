let {Model} = require('./db.js');
let Resource = require('./Resource.js');

class Category extends Model {
    static get tableName() {
        return 'category';
    }

    static get relationMappings() {
        return {
            resources: {
                relation: Model.HasManyRelation,
                modelClass: Resource,
                join: {
                    from: 'category.id',
                    through: {
                        from: 'resource_category.category_id',
                        to: 'resource_category.resource_id'
                    },
                    to: 'resource.id'
                }
            }
        };
    }
}

module.exports = Category;