var mongo =require('mongodb');

  var connMongoDB = function(){
  
  var db =new mongo.Db(
    'got',
    new mongo.Server(
      'localhost', //endereco
      27017,  //porta de conexao
      {}
    ),
    {}
  );
  return db;
}

module.exports =function(){
  return connMongoDB;
}
