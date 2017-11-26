function load(){
  this.reload = false;
  this.toggle = function(bool){
    this.reload = bool;
  }
}

let temp = new load();

module.exports = temp;
