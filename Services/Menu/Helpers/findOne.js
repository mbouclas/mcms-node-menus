module.exports = (function(App,Connection,Package,privateMethods) {
    var Model = Connection.models.Menu;
    var async = require('async'),
        lo = require('lodash'),
        Options = {
            sync : false
        },
        Menu = {},
        availableMenuModels = privateMethods.getAvailableMenuModels();

    function findOne(parent,options,callback) {

        Options = lo.merge(Options,options);
        var asyncObj = {};

        get(parent,callback);
    }

    function get(parent,next){
        Model.findOne(parent).exec(function(err,root){
            if (err){
                return next(err);
            }

            if (!root){
                return next(null,[]);
            }

            root.getArrayTree({sort: { orderBy: 1 }},function(err,docs){
                if (Options.sync){
                    var asyncArr = [];
                    //This is where things get interesting. We need to fetch all items and go find their current
                    //values in the DB
                    var flatTree = flattenTree(docs[0].children);

                    //Create a group of arrays per model
                    var groups = lo.groupBy(flatTree,'model');
                    //loop the groups and look up for the actual data
                    for (var model in groups){

                        asyncArr.push(getActualItem.bind(null,model,groups[model]));

                    }

                    //replace
                    async.parallel(asyncArr,function(error,results){
                        var sorted = [];
                       next(null,sortBy(docs[0].children,'orderBy','') || []);
                    });
                    //console.log(docs[0].children)
                }
            });

        });
    }

    function sortBy(arr,field,way){
        way = way || '';
        var ret = [];
        for (var i in arr){
            if (arr[i].children){
                sortBy(arr[i].children,field,way);
            }
        }

        ret = lo.sortBy(arr,way+field);
        return ret;
    }

    function getActualItem(model,docs,next){
        var ids = [],
            titleField;

        for (var i in docs){
            if (docs[i].settings && docs[i].settings.sync){//we need to see if individual items want to sync
                ids.push(docs[i].itemId);
            }
            titleField = docs[i].titleField;//overwrite all. We can't have an array in a single query
        }

        if (ids.length == 0){
            return next(null,{});
        }

        App.Connections.mongodb.models[model].where('_id').in(ids).exec(function(err,results){
            if (err){
                console.log(err);
                return next(err);
            }

            for (var a in results){
                var found = lo.find(docs,{itemId : results[a]._id});

                if (found){
                    found.title = results[a][titleField];
                    found.permalink = buildLink(model,results[a]);//Grab the patern from the service provider based on the model
                }
            }

            next(null,results);
        });
    }

    function buildLink(model,item){
        //look up in the service providers for this model and if found grab the permalinkPattern
        if (availableMenuModels[model]){
            var regex = new RegExp('(:[a-zA-z0-9]+)','g'),
                params = availableMenuModels[model].permalinkPattern.match(regex),
                permalink = availableMenuModels[model].permalinkPattern;

            for (var i in params){
                var param = params[i].replace(':','');

                permalink = permalink.replace(params[i],item[param]);

            }

            return permalink;
        }
    }

    function flattenTree(tree,arr){
        if (!arr){
            arr = [];
        }

        for (var i in tree){
            if (tree[i].children){
                flattenTree(tree[i].children,arr);
            }
            arr.push(tree[i]);
        }

        return arr;
    }

    return findOne;
});