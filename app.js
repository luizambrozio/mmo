/* importar config servidor*/

var app = require('./config/server');

/*porta de escuta*/
app.listen(3000, function(){
  console.log('servidor on');
});
