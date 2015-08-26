module.exports = (function (App, Package) {
    var defaultDB = App.Config.database.default,
        Connection = App.Connections[defaultDB],
        privateMethods = {
            getAvailableMenuModels : require('./Helpers/private/getAvailableMenuModels')(App, Connection, Package)
        };


    return {
        name: 'Menu',
        nameSpace: 'Menu',
        findOne: require('./Helpers/findOne')(App, Connection, Package, privateMethods),
        find: require('./Helpers/find')(App, Connection, Package, privateMethods),
        create: require('./Helpers/create')(App, Connection, Package, privateMethods),
        update: require('./Helpers/update')(App, Connection, Package, privateMethods),
        addToCache: require('./Helpers/addToCache')(App, Connection, Package, privateMethods)

    };
});