var ObjectID = require('mongodb').ObjectId;
var mongo = require('mongodb');

var connMongoDB = function(callback){

	var objDb = new mongo.Db(
		'got',
		new mongo.Server(
			'ds163699.mlab.com', //string contendo o endereço do servidor
			63699, //porta de conexão
			{}
		),
		{}
	);

	objDb.open(function(err, db) {
		db.authenticate('root', '123', function(err, result) {
			callback(db)
		})
	})
}

function jogoDAO(connection) {
  this._connection = connMongoDB;
}

jogoDAO.prototype.gerarParametros = function (usuario) {
  this._connection(function(mongoclient){
    console.log('entro jogoDAO');
    mongoclient.collection("jogo", function(err, collection){
      collection.insert({
        usuario: usuario,
        moeda: 15,
        suditos: 10,
        temor: Math.floor(Math.random()*1000),
        sabedoria: Math.floor(Math.random()*1000),
        comercio: Math.floor(Math.random()*1000),
        magia: Math.floor(Math.random()*1000)
      });
    mongoclient.close();
    });
  });
};

jogoDAO.prototype.iniciarJogo = function (req, res, usuario, msg) {
  this._connection(function(mongoclient){
    mongoclient.collection("jogo", function(err, collection){
      collection.find({usuario : usuario}).toArray(function(err, result){
        res.render('jogo', {img_casa: req.session.casa, jogo : result[0], msg : msg});
      mongoclient.close();
      });
    });
  });
};

jogoDAO.prototype.acao = function (acao) {
  this._connection(function(mongoclient){
    mongoclient.collection("acao", function(err, collection){

      var date = new Date();
      var tempo = null;

      switch (parseInt(acao.acao)) {
        case 1: tempo = 1 * 60* 60000;break;
        case 2: tempo = 2 * 60* 60000;break;
        case 3: tempo = 5 * 60* 60000;break;
        case 4: tempo = 5 * 60* 60000;break;
      }
      acao.data_termino = date.getTime() + tempo;

      collection.insert(acao);

    });

    mongoclient.collection("jogo", function(err, collection){

      var moedas = null;

      switch (parseInt(acao.acao)) {
        case 1: moedas = -2 * acao.quantidade;break;
        case 2: moedas = -3 * acao.quantidade;break;
        case 3: moedas = -1 * acao.quantidade;break;
        case 4: moedas = -1 * acao.quantidade;break;
      }

      collection.update({usuario : acao.usuario},{$inc : {moeda: moedas}});

    });
      mongoclient.close();
  });
};

jogoDAO.prototype.getAcoes = function (res, usuario) {
  this._connection(function(mongoclient){
    mongoclient.collection("acao", function(err, collection){

      var date = new Date();

      var momento_atual = date.getTime();

      collection.find({usuario : usuario, data_termino : {$gt : momento_atual}}).toArray(function(err, result){
        res.render("pergaminhos", {acoes: result});
      mongoclient.close();
      });
    });
  });
}

jogoDAO.prototype.revogar_acao = function (res, _id) {
  this._connection(function(mongoclient){
    mongoclient.collection("acao", function(err, collection){
      collection.remove({_id : ObjectID(_id)},function(err, result){
        res.redirect("jogo?msg=D");
      });
      mongoclient.close();
    });
  });
};

module.exports = function(){
  return jogoDAO;
}
