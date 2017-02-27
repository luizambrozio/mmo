var mongo =require('mongodb');

  var connMongoDB = function(){
  console.log('entrou na funcao de conexao');
  var db =new mongo.Db(
    'got',
    new mongo.Server(
      'root:123@ds163699.mlab.com', //endereco
      63699,  //porta de conexao
      {}
    ),
    {}
  );
  return db;
}

module.exports =function(){
  return connMongoDB;
}
