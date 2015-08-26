module.exports = (function(App,Connection,Package,privateMethods) {
    var Model = Connection.models.Menu;
    var async = require('async'),
        lo = require('lodash');

    return function(callback){
        if (!App.Cache.Menu){
            App.Cache.Menu = {};
        }

        Model.find({parentId:null},function(err,roots){
            if (err){
                return callback(err);
            }

            var asyncObj = {};
            for (var i in roots){
                asyncObj[roots[i].permalink] = getTree.bind(null,roots[i]);
            }

            async.parallel(asyncObj,callback);
        });
    };

    function getTree(parent,next){

        Package.services.Menu.findOne({permalink:parent.permalink},{sync:true},function(err,tree){
            App.Cache.Menu[parent.permalink] = tree;
            next(null,tree);
        });
    }

});