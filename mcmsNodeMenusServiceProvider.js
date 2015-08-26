module.exports = (function(App){
    var Command = App.Command(App);
    var path = require('path');
    /*
     * VERY IMPORTANT!!!!
     * Each service provider should expose an object that describes the available menu items
     * Thus looping through the service providers we can get the info needed to create a menu
     * without all the info, just by getting an itemId and a parent
     * E.G. service provider of eshop exposes this.MenuConfig = {Product : {model : 'Product', type : 'Product', module : 'mcmsNodeEshop'},ProductCategory..}
     *
     * This way, in the UI, we can show all available modules and their items for the user to select module -> type
     * */
    function mcmsNodeMenusServiceProvider(){
        this.packageName = 'mcmsNodeMenus';
        this.services = {};
        this.controllers = {};
        var _this = this;

        App.dbLoader[App.Config.database.default].loadModels(__dirname + '/Models/' + App.Config.database.default);
        this.services = App.Helpers.services.loadService(__dirname + '/Services',null,this);
        App.Services[this.packageName] = this.services;
        if (App.CLI){
/*            var commandFolder = path.join(__dirname , './bin/Command/');
            Command.registerCommand([

            ]);*/

            return;
        }

        setTimeout(function(){
            var Menu = App.Connections.mongodb.models.Menu;
/*            Menu.findOne({permalink : 'backpacks'}).exec(function(err,root){
                var item = {
                        title: 'another submenu',
                        permalink : 'another-submenu',
                        link : 'another-submenu',
                        type : 'link',
                        orderBy : 10
                    },
                    options = {
                        settings: {
                            sync : false
                        }
                    };
                root.appendChild(item);
            });*/


            var Header = Menu.findOne({title : 'Header Menu'}).exec(function(err,root){
/*                App.Connections.mongodb.models.ProductCategory
                    .find({permalink: {$in: ['accessories', 'backpacks', 'shoulder-bags', 'minibags', 'travel']}})
                    .exec(function (err, categories) {
                        for (var i in categories){
                            _this.services.Menu.create(root,categories[i],{
                                titleField : 'category',
                                baseLink : 'product-category',
                                type : 'ProductCategory',
                                module : 'mcmsNodeEshop',
                                active : true
                            },function(err,result){
                                console.log(result);
                            });
                        }
                    });*/
/*                _this.services.Menu.create(root,{
                    title : 'Contact',
                    permalink : 'contact',
                    link : 'contact',
                    type : 'link',
                    orderBy : 10,
                    active : true
                },{

                });*/

/*                root.appendChild(sampleMenu);*/

            });
/*            var Footer = Menu.findOne({title : 'Footer Menu'}).exec(function(err,root){
                console.log(root)
            });*/

        },2000);
    }



    return new mcmsNodeMenusServiceProvider();
});