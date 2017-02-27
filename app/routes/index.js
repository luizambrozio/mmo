module.exports = function(application){
  application.get('/', function(req, res){
    application.app.controller.index.index(application, req, res);
  })

  application.post('/autenticar', function(req, res){
    application.app.controller.index.autenticar(application, req, res);
  })
}
