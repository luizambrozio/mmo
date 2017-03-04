var mongo = require('mongodb');
var crypto = require('crypto');

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

function UsuariosDAO(connection){
	this._connection = connMongoDB;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario, res){
	this._connection(function(mongoclient) {

		mongoclient.collection("usuarios", function(err, collection){
      var senha_cripyto = crypto.createHash("md5").update(usuario.senha).digest("hex");

      usuario.senha = senha_cripyto;

      collection.insert(usuario);

			mongoclient.close();
		});
	})
  var msn = 'C'
  res.render('index',{validacao:{}, msn});
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection(function(mongoclient){
		mongoclient.collection("usuarios", function(err, collection){

			var senha_cripyto = crypto.createHash("md5").update(usuario.senha).digest("hex");
			usuario.senha = senha_cripyto;

			collection.find(usuario).toArray(function(err, result){

				if(result[0] != undefined){
					req.session.autorizado = true;
					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}

				if(req.session.autorizado){
					res.redirect("jogo");
				} else {
					var msn = 'V'
          res.render("index", {validacao: {}, msn});
          return;
				}

			});
			mongoclient.close();
		});
	});
}

module.exports = function(){
	return UsuariosDAO;
}
