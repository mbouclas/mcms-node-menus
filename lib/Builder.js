module.exports = (function(){
    var lo = require('lodash');
    var items,
        groupStack,
        reserved = ['route', 'action', 'url', 'prefix', 'parent', 'secure', 'raw'],
        Item = require('./Item')(),
        Html = require('html-sourcery'),
        menuInstance = null;
    Builder.prototype.last_id = 0;

    function Builder(name,parentNode,conf){
        this.name = name;
        this.parent = parentNode;
        this.instance = name;
        this.items = [];
        this.childNodes = [];
        this.depth = (lo.isObject(parentNode)) ? parentNode.depth + 1 : 0;
        this.conf = conf;
        this.htmlAttributes = [];
        menuInstance = this;
    }

    //Adds an item to the menu
    Builder.prototype.add = function(title,options){
        if (!options){
            options = {};
        }
        var newNode = new Builder(title,this.instance);
        item = new Item(newNode,this.id(),title,options);
        newNode.setAttributes(options);
        this.items.push(newNode);
        this.last_id = item.id;
        this.childNodes.push(newNode);
        return newNode;
    };

    //Generate an integer identifier for each new item
    Builder.prototype.id = function(){
        return this.last_id +1;
    };

    //Add raw content
    Builder.prototype.raw = function(title,options){
        if (!options){
            options = {};
        }

        options.raw = true;

        return add(title,options);
    };

    //Returns menu item by name
    Builder.prototype.get = function(title){
        return lo.find(this.items,{nickname : title});
    };

    //Returns menu item by Id
    Builder.prototype.find = function(id){
        return lo.find(this.items,{id : id});
    };

    //Returns children
    Builder.prototype.children = function(){
        return this.childNodes;
    };

    //return all items
    Builder.prototype.all = function(){
        return this.items;
    };

    //return first item
    Builder.prototype.first = function(){
        return lo.first(this.items);
    };

    //return last item
    Builder.prototype.last = function(){
        return lo.last(this.items);
    };

    //Returns menu item by name
    Builder.prototype.item = function(title){
        return get(title);
    };

    //add a separator after the item
    Builder.prototype.divide = function(attributes){
        if (!attributes){
            attributes = {};
        }

        attributes.class = formatGroupClass({class : 'divider'},attributes);
        var lastItem = lo.last(this.items);
        lastItem.divider = attributes;
    };

    //Create a menu group with shared attributes.
/*    group({
        style: 'padding: 0', 'data-role': 'navigation'
    },[
        'item-1',
        'item-2'
    ]);*/
    //applyTo can be an array of strings or an object with array strings to look for
    //when passed a string we assume it is the title
    // {id : [1,2,3] OR {nickname : ['item-1','item-2','item-3']}
    Builder.prototype.group = function(attributes,applyTo){

        applyTo.forEach(function(item){
            var check = Builder.prototype.get(item);
            if (check){
                check.attributes = lo.merge(check.attributes,attributes);
            }
        });
    };

    function simplify(item){
        var node = new Item();
        return node.extractProperties(item);
    }

    //return the tree to array
    Builder.prototype.toArray = function(treeToIterate){
        if (!treeToIterate){
            treeToIterate = this.items;
        }
        var tree = [],
            _this = this;

        treeToIterate.forEach(function(item){
            var node = simplify(item);

            if (item.childNodes.length > 0){
                node.children = _this.toArray(item.childNodes);
            }

            tree.push(node);
        });

        return tree;
    };

    //return the menu to JSON format
    Builder.prototype.toJSON = function(){
        return JSON.stringify(this.toArray());
    };

    //generates the HTML needed for a single item (<li><a>string</a></li>)
    function itemHtml(item,children){
        var el = [];

        if (!item.htmlAttributes){
            item.htmlAttributes = {}
        }
        el.push(Html.a(item.htmlAttributes,item.name));

        if (children){
            el.push(children);
        }

        return Html.li({},
            el
        );
    }

    Builder.prototype.toHtml = function(treeToIterate,compiled){
        //grab all items as array
        //recursively iterate producing a li foreach item
        //return a compiled version
        if (!treeToIterate){
            treeToIterate = this.items;
        }
        if (typeof compiled == 'undefined'){
            compiled = true;
        }

        var tree = [],
            _this = this,
            Source;

        treeToIterate.forEach(function(item){

            if (item.childNodes.length > 0){
                var children = _this.toHtml(item.childNodes,false);
            }

            var node = itemHtml(item,children);
            tree.push(node);
        });

        Source = Html.ul(this.getRenderHtmlAttributes(),tree);
        if (compiled){
            return Source.compile();
        }

        return Source;
    };

    Builder.prototype.getRenderHtmlAttributes = function(){
        // Attributes
        var htmlAttributes = [];

        for (var key in this.htmlAttributes) {
            htmlAttributes[key] = this.htmlAttributes[key];
        }

        // Get Class Array
        var htmlClassArray = [];

        // If Classes Are Already Defined, We Need to Append Rather Than Replace
        if (this.htmlAttributes.hasOwnProperty('class')) {
            htmlClassArray = this.htmlAttributes.class.split(' ');
        }

        // Handle Active State
        if (this.isActive) {
            htmlClassArray.push('active');
        }

        // Handle Depth
        htmlClassArray.push('level-' + this.depth);

        // Handle Case of Being Only Child, Then First, Then Last
        if (this.isFirst && this.isLast) {
            htmlClassArray.push('only');
        } else if (this.isFirst) {
            htmlClassArray.push('first');
        } else if (this.isLast) {
            htmlClassArray.push('last');
        }

        // Handle Case of Being A Parent
        if (this.isParent()) {
            htmlClassArray.push('parent');
        }

        // Join Class List
        htmlAttributes.class = htmlClassArray.join(' ');

        // Return
        return htmlAttributes;
    };

    //check if parent
    Builder.prototype.isParent = function() {
        return this.childNodes.length > 0;
    };

    //add attributes to menu
    Builder.prototype.setAttributes = function(attributes) {
        this.htmlAttributes = attributes;
        return this;
    };

    Builder.prototype.middleware = function(req,res,next){
        res.locals.Menu = {
            render : menuInstance.toHtml()
        };
        next();
    };

    return Builder;
});