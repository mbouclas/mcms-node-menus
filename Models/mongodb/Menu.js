module.exports = function (mongoose, modelName) {
    var materializedPlugin = require('mongoose-materialized');
    // Define your mongoose model as usual...
    var schema = mongoose.Schema({
        title: { type: String, index: true },
        permalink: { type: String, index: true },
        itemId: { type: {}, index: true },
        link: String,
        module: String,
        model: String,
        titleField: String,
        type: String,
        seoTitle : String,
        orderBy: Number,
        active: Boolean,
        created_at: {type : Date, default : Date.now},
        updated_at: {type : Date, default : Date.now},
        settings : {}
    }, {
        strict: false,
        id : true
    });
    schema.set('toObject', { getters: true, virtuals: true });
    schema.set('toJSON', { getters: true, virtuals: true });
    schema.plugin(materializedPlugin);

    mongoose.model(modelName, schema);
};