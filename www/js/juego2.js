var app = {

  inicio: function() {
    DIAMETRO_BOLA = 50;
    velocidadY = 200;

    alto = document.documentElement.clientHeight;
    ancho = document.documentElement.clientWidth;

    app.iniciaJuego();
  },

  iniciaJuego: function() {

    var estados = { preload: preload, create: create, update: update };
    game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);

    function preload() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.stage.backgroundColor = '#000';
      game.load.image('bola', 'assets/bola.png');
      game.load.image('obstaculo', 'assets/objetivo.png');
    }

    function create() {
      app.crearBola();
      app.crearObstaculo();
    }

    function update() {
      game.physics.arcade.overlap(bola, obstaculo, app.destruirBola, null, this);
    }

  },

  crearBola: function() {
    bola = game.add.sprite(Math.floor(Math.random()*(ancho-50)), 0, 'bola');
    game.physics.arcade.enable(bola);
    bola.body.velocity.y = 200;
    bola.body.collideWorldBounds = true;
    bola.body.onWorldBounds = new Phaser.Signal();
    bola.body.onWorldBounds.add(app.destruirBola, this);
  },

  crearObstaculo: function() {
    obstaculo = game.add.sprite(app.inicioX(), app.inicioY(), 'obstaculo');
    game.physics.arcade.enable(obstaculo);
  },

  destruirBola: function() {
    bola.destroy();
    app.crearBola();
  },
  
  inicioX: function() {
    return app.numeroAleatorioHasta(ancho - DIAMETRO_BOLA);
  },

  inicioY: function() {
    return app.numeroAleatorioHasta(alto - DIAMETRO_BOLA);
  },

  numeroAleatorioHasta: function(limite) {
    return Math.floor(Math.random() * limite);
  }
}

if ('addEventListener'in document) {
  document.addEventListener('deviceready', function() {
    app.inicio();
  }, false);
}