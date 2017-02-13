var app={
  inicio: function(){
    DIAMETRO_BOLA = 40;
    dificultad = 0;
    velocidadX = 0;
    velocidadY = 0;
    velocidad2X = 0;
    velocidad2Y = 0;
    puntuacion = 0;
    
    alto  = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;
    
    app.vigilaSensores();
    app.iniciaJuego();
  },

  iniciaJuego: function(){

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);

      game.stage.backgroundColor = '#000';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('objetivoUno', 'assets/objetivo.png');
    }

    function create() {
      scoreText = game.add.text(16, (alto/2), puntuacion, { fontSize: '200px', fill: '#757676' });
       
      bola = game.add.sprite(0, 0, 'bola');
      game.physics.arcade.enable(bola);
      bola.body.velocity.y = 200;
      bola.body.collideWorldBounds = true;
      bola.body.onWorldBounds = new Phaser.Signal();
      //bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);

      objetivoUno = game.add.sprite(app.inicioX(), alto , 'objetivoUno');
      game.physics.arcade.enable(objetivoUno);
      objetivoUno.body.collideWorldBounds = true;
      objetivoUno.body.onWorldBounds = new Phaser.Signal();
    }

    function update(){
      var factorDificultad = (300 + (dificultad * 100));
      bola.body.velocity.y = (velocidadY * factorDificultad);
      bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

      objetivoUno.body.velocity.y = (velocidad2Y * factorDificultad);
      objetivoUno.body.velocity.x = (velocidad2X * (-1 * factorDificultad));
      
      game.physics.arcade.overlap(bola, objetivoUno, app.incrementaPuntuacionUno, null, this);
    }

    var estados = { preload: preload, create: create, update: update };
    var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser',estados);
  },

  decrementaPuntuacion: function(){
    puntuacion = puntuacion-1;
    scoreText.text = puntuacion;
  },

  incrementaPuntuacionUno: function(){
    puntuacion = puntuacion+1;
    scoreText.text = puntuacion;

    objetivoUno.body.x = app.inicioX();
    objetivoUno.body.y = alto;

  },

  inicioX: function(){
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA );
  },

  inicioY: function(){
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA );
  },

  numeroAleatorioHasta: function(limite){
    return Math.floor(Math.random() * limite);
  },

  vigilaSensores: function(){
    
    function onError() {
        console.log('onError!');
    }

    function onSuccess(datosAceleracion){
      app.detectaAgitacion(datosAceleracion);
      app.registraDireccion(datosAceleracion);
    }

    navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency: 10 });
  },

  detectaAgitacion: function(datosAceleracion){
    var agitacionX = datosAceleracion.x > 10;
    var agitacionY = datosAceleracion.y > 10;

    if (agitacionX || agitacionY){
      setTimeout(app.recomienza, 1000);
    }
  },

  recomienza: function(){
    document.location.reload(true);
  },

  registraDireccion: function(datosAceleracion){
    velocidadX = datosAceleracion.x ;
    velocidadY = 0;
    //velocidadY = datosAceleracion.y ;//solo se mueve el eje x

    velocidad2X = 0;
    velocidad2Y = datosAceleracion.y;
  }

};

if ('addEventListener' in document) {
    document.addEventListener('deviceready', function() {
        app.inicio();
    }, false);
}