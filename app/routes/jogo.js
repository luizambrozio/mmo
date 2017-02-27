module.exports = function(application){
  application.get('/jogo', function(req, res){
    application.app.controller.jogo.jogo(application, req, res);
  });

  application.get('/sair', function(req, res){
    application.app.controller.jogo.sair(application, req, res);
  });

  application.get('/suditos', function(req, res){
    application.app.controller.jogo.suditos(application, req, res);
  });

  application.get('/pergaminhos', function(req, res){
    application.app.controller.jogo.pergaminhos(application, req, res);
  });

  application.post('/ordernar_acao_suditos', function(req, res){
    application.app.controller.jogo.ordernar_acao_suditos(application, req, res);
  });
}
