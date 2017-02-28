var crypto = require("crypto");

function UsuariosDAO(connection) {
  this._connection =connection();
}

UsuariosDAO.prototype.inserirUsuario = function (usuario) {
  this._connection.open(function(err, mongoclient){
    mongoclient.collection("usuarios", function(err, collection){

      var senha_cripyto = crypto.createHash("md5").update(usuario.senha).digest("hex");

      usuario.senha = senha_cripyto;

      collection.insert(usuario);

    mongoclient.close();
    });
  });
};

UsuariosDAO.prototype.autenticar = function (usuario, req, res) {
  this._connection.open(function(err, mongoclient){
    mongoclient.collection("usuarios", function(err, collection){

      var senha_cripyto = crypto.createHash("md5").update(usuario.senha).digest("hex");

      usuario.senha = senha_cripyto;

      collection.find(usuario).toArray(function(err, result){
        if(result[0]!=undefined){
          req.session.logado=true;

          req.session.usuario=result[0].usuario;

          req.session.casa=result[0].casa;
        }

        if(req.session.logado){
          res.redirect("jogo");
        }else {
          var msn = 'V'
          res.render("index", {validacao: {}, msn});
          return;
        }

      });
      mongoclient.close();
    });
  });
};


module.exports = function(){
  return UsuariosDAO;
}
