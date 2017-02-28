module.exports.jogo = function(application, req, res){
  if(req.session.logado !== true){
        res.send('vc não estalogado')
        return;
  }

  var msg = ''
  if(req.query.msg != ''){
      msg = req.query.msg;
  }

  var usuario = req.session.usuario;
  var connection = application.config.dbconnection;
  var jogoDAO = new application.app.models.jogoDAO(connection);


  jogoDAO.iniciarJogo(req, res, usuario, msg);

}

module.exports.sair = function(application, req, res){

    req.session.destroy(function(err){
      var msn = 'E'
      res.render("index", {validacao: {}, msn});
    });

}

module.exports.suditos = function(application, req, res){
  res.render("aldeoes", {validacao: {}});
}

module.exports.pergaminhos = function(application, req, res){

  var connection = application.config.dbconnection;
  var jogoDAO = new application.app.models.jogoDAO(connection)

  var usuario = req.session.usuario;
  jogoDAO.getAcoes(res, usuario);

}

module.exports.ordernar_acao_suditos = function(application, req, res){
  var dadosForm  = req.body;

  req.assert('acao',  'Acao deve ser informada').notEmpty();
  req.assert('quantidade',  'quantidade deve ser informada').notEmpty();

  var erros = req.validationErrors();

  if(erros){
    res.redirect('jogo?msg=A');
    return;
  }

  var connection = application.config.dbconnection;
  var jogoDAO = new application.app.models.jogoDAO(connection);

  dadosForm.usuario = req.session.usuario;
  jogoDAO.acao(dadosForm);

  res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){
  var url_query = req.query;
  var _id = url_query.id_acao;

  var connection = application.config.dbconnection;
  var jogoDAO = new application.app.models.jogoDAO(connection);

  jogoDAO.revogar_acao(res, _id);
}
