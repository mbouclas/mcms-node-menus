module.exports = (function(App,Connection,Package,privateMethods) {
    var Model = Connection.models.Menu;
    var slug = require('slug'),
        async = require('async'),
        lo = require('lodash'),
        Options = {
            baseLink : ''
        },
        Menu = {};

    //The logic behind this is :
    //We pass a parent (if not we assume root), and add that menu to the parent.

    function create(parent,menu,options,callback) {
        Options = lo.merge(Options,options);
        Menu = menu;
        var checkForObject = App.Helpers.MongoDB.isMongooseObject(parent);

        if (checkForObject){//mongoose ID, find first then  add a child
            if (checkForObject == 'string'){
                parent = App.Helpers.MongoDB.idToObjId(parent);
            }

            findParentByIdAndAppendChild(parent,menu,callback);
        } else if (parent instanceof Model){//we have the entire parent, just append the child
            appendChild(parent,menu,callback);
        } else if (parent && !menu){//we have to assume they want to create the parent

        }
        else { //searching by some filter
            findParentByFilterAndAppendChild(parent,menu,callback);
        }


    }

    function findParentByIdAndAppendChild(parent,child,callback){
        Model.findById(parent).exec(function(err,root){
            if (err){
                return callback(err);
            }

            appendChild(root,child,callback);
        });
    }

    function findParentByFilterAndAppendChild(parent,child,callback){
        Model.findOne(parent).exec(function(err,root){
            if (err || !root){
                return callback(err || 'notFound');
            }

            appendChild(root,child,callback);
        });
    }

    function appendChild(root,child,callback){
        var newChild = {
            title : child[Options.titleField] || child.title,
            permalink : child.permalink || slug(child.title,{lower:true}),
            itemId : App.Helpers.MongoDB.idToObjId(child._id),
            module : Options.module,
            type : Options.type,
            orderBy : child.orderBy || 0,
            active : Options.active || false
        };
        newChild.link =  Options.baseLink + '/' + child.permalink;

        root.appendChild(newChild,callback);
    }

    return create;
});