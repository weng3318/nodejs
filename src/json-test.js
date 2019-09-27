const router = require('router');

var point = {'x':6,'y':3,'cd':function(){
  alert(this.x+','+this.y)
}};

point.cd()

module.exports(router)