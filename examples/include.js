module.exports = (function(){

    function Builder(){
        this.test = 1;
    }

    Builder.prototype.items = [];

    Builder.prototype.balls = function(item){
        this.items.push(item);
        console.log(this.items);
    };

    return Builder;
});
