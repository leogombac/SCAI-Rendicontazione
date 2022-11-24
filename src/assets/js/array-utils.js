Array.prototype.concatAll = function (){
    return this.reduce((a, b) => (a.push(...b), a), []);
}

Array.prototype.concatMap = function (fn){
    return this.map(fn).concatAll();
}