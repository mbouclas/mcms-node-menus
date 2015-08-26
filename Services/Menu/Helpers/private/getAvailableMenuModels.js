module.exports = (function(App,Connection,Package){
    var lo = require('lodash');

    return function(){
        var models = {};
        if (!App.Config.menu){
            return {};
        }

        App.Config.menu.forEach(function(provider){
            for (var model in provider.items){
                models[model] = provider.items[model];
            }
        });

        return models;
    }
});