var lo = require('lodash'),
    String = require('string'),
    slug = require('slug');

module.exports = (function(){
    function Item(builder,id,title,options){
        if (arguments.length == 0){
            return this;
        }

        return {
            tittle : title,
            attributes : options.attributes || {},
            nickname : slug(title).toLowerCase(),
            id : id,
            parent : (lo.isArray(options) && options['parent']) ? options['parent'] : null
        }
    }

    Item.prototype.extractProperties = function(item){
        return {
            name : item.name,
            attributes : item.attributes,
            nickname : item.nickname || slug(item.name).toLowerCase(),
            children : []
        }
    };


    //Add attributes to the item
    function attr(){
        var args = arguments;
    }
    return Item;
});