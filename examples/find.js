var MenuManager = require('../lib/Builder')(),
    Menu = new MenuManager();
var Home = Menu.add('Home',{href: '/'});

var CM = Menu.add('Content Management')
    .setAttributes({class : 'menu', id : 'content-management'});

var Child = Home.add('subMenu1')
    .setAttributes({class : 'menu', id : 'sub-menu'});
Home.add('subMenu2');
Home.add('subMenu3')
    .add('sub-subMenu1');
Home.add('subMenu4');
//console.log(Menu.all());
//console.log(Home.children());
//console.log(Child);

console.log(Menu.toHtml());