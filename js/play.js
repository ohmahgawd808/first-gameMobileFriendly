	var playState = {
	create: function () {
this.player = game.add.sprite(game.width/2, game.height/2, "player");
this.player.anchor.setTo(0.5, 0.5);
game.physics.arcade.enable(this.player);
this.player.body.gravity.y = 500;
this.cursor = game.input.keyboard.createCursorKeys();
this.jumpSound = game.add.audio('jump');
this.coinSound = game.add.audio('coin');
this.deadSound = game.add.audio('dead');
this.player.animations.add('right', [1, 2], 8, true);
this.player.animations.add('left', [3, 4], 8, true);
this.emitter = game.add.emitter(0, 0, 15);
this.emitter.makeParticles('pixel');
this.emitter.setYSpeed(-150, 150);
this.emitter.setXSpeed(-150, 150);
this.emitter.setScale(2, 0, 2, 0, 800);
this.emitter.gravity = 0;

if (!game.device.desktop) {
	this.addMobileInput();
}

if (!game.device.desktop) {
	this.rotateLabel = game.add.text(game.width/2, game.height/2, '', {font: '30px Arial', fill: '#fff', backgroundColor: '#000'});
	this.rotateLabel.anchor.setTo(0.5, 0.5);

	game.scale.onOrientationChange.add(this.orientationChange, this);

	this.orientationChange();
}

// ----------------- Enemy Code ------------------------- //

this.enemies = game.add.group(); // Create an enemy group with arcade physics
this.enemies.enableBody = true; 

this.enemies.createMultiple(150, 'enemy'); // Create 10 enemies in the group with enemy image -- they are dead by default
game.time.events.loop(500, this.addEnemy, this); //this.addEnemy is a function // 2200 is in MS -- 2.2 seconds //
game.time.events.loop(500, this.addEnemy2, this); //this.addEnemy is a function // 2200 is in MS -- 2.2 seconds //
game.time.events.loop(1000, this.addEnemy3, this); //this.addEnemy is a function // 2200 is in MS -- 2.2 seconds //

// ----------------- Wall Code ------------------------- //

this.walls = game.add.group(); // add wall group
this.walls.enableBody = true;
game.add.sprite(0, 0, "wallV", 0, this.walls); // This is the LEFT wall!
game.add.sprite(480, 0, "wallV", 0, this.walls); // And this is the RIGHT!

game.add.sprite(0, 0, "wallH", 0, this.walls); // This is the TOP LEFT wall!
game.add.sprite(300, 0, "wallH", 0, this.walls); // This is the TOP RIGHT wall!
game.add.sprite(0, 320, "wallH", 0, this.walls); // This is the BOTTOM LEFT wall!
game.add.sprite(300, 320, "wallH", 0, this.walls); // This is the BOTTOM RIGHT wall!

game.add.sprite(-100, 160, "wallH", 0, this.walls); // This is the MIDDLE LEFT wall!
game.add.sprite(400, 160, "wallH", 0, this.walls); // This is the MIDDLE RIGHT wall!

var middleTop = game.add.sprite(100, 80, "wallH", 0, this.walls);
middleTop.scale.setTo(1.5, 1);
var middleBottom = game.add.sprite(100, 240, "wallH", 0, this.walls);
middleBottom.scale.setTo(1.5, 1);

this.walls.setAll("body.immovable", true);

// ----------------- Wall Code ------------------------- //

this.coin = game.add.sprite(60, 140, "coin");
game.physics.arcade.enable(this.coin);
this.coin.anchor.setTo(0.5, 0.5);

this.scoreLabel = game.add.text(30, 30, "Score: 0", {font: "18px Impact", fill: "#ffffff"});
game.global.score = 0;


	},
	
	update: function() { //keep in mind that physics should be on the top of update functions because it is universally applied throughout the game
		game.physics.arcade.collide(this.player, this.walls);
		game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
		game.physics.arcade.collide(this.enemies, this.walls);
		game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		this.movePlayer();
		if(!this.player.inWorld) { // ! <-- means if NOT // ta maiiiii pen ya ngee tong pen ya ngunnnnn LOL
			this.playerDie();
		if(!this.player.alive) {
			return;
		}


			
		}
		
	},

	movePlayer: function() {
if (this.cursor.left.isDown || this.wasd.left.isDown || this.moveLeft) {
	this.player.body.velocity.x = -200;
	this.player.animations.play('left');
	}

else if (this.cursor.right.isDown || this.wasd.right.isDown || this.moveRight) {
	this.player.body.velocity.x = 200;
	this.player.animations.play('right');
	}

else {
	this.player.body.velocity.x = 0;
	this.player.animations.stop();
	this.player.frame = 0;
	}

if (this.cursor.up.isDown || this.wasd.up.isDown) {
	this.jumpPlayer();
	this.jumpSound.play();
	}
	if (game.input.totalActivePointers == 0){
	this.moveLeft = false;
	this.moveRight = false;
}

},

	playerDie: function() {
this.player.kill();

this.deadSound.play();
this.emitter.x = this.player.x;
this.emitter.y = this.player.y;
this.emitter.start(true, 800, null, 15);

game.camera.flash(0xffffff, 300);
game.camera.shake(0.02, 300);

game.time.events.add(1000, this.startMenu, this);


},

	startMenu: function() {
		game.state.start('menu');
	},

	takeCoin: function() {
		game.global.score += 5; // + sign is a storage that adds 5 on top of previously added 5 
		this.scoreLabel.text = "Score: " + game.global.score;
		this.updateCoinPosition();
		this.coinSound.play();
	},

	updateCoinPosition: function() {

			var coinPosition = [
			{x: 140, y: 60}, {x: 360, y:60},
			{x: 50, y: 140}, {x: 440, y:140},
			{x: 130, y: 300}, {x: 170, y:300}
		];
		
		for (var i = 0; i < coinPosition.length; i++){
			if(coinPosition[i].x == this.coin.x) {
				coinPosition.splice(i, 1);
			}
		}
		
		var newPosition = game.rnd.pick(coinPosition);
		
		this.coin.reset(newPosition.x, newPosition.y);
	},

	addEnemy: function() {
		var enemy = this.enemies.getFirstDead(); // get the first dead enemy of the group // this.enemies calls the 10 enemies from the group

		if (!enemy) { // if we do not have dead enemy -- do nothing (return)
			return;
		}

			// ------ This part initialize the enemies ------- //
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.width/2, 0);
		enemy.body.gravity.y = 500; //gravity, 500 is positive hence falling down
		enemy.body.velocity.x = 200 * game.rnd.pick([-1, 1]);//velocity.x means horizontal force//-1, 1 means random between these values//100 * is just increasing speed to the -1, 1 
		enemy.body.bounce.x = 1;//bounce.x means collision will bounce it to another direction in x axis /1 means perfect bounce/0 means no bounce/can put 0.5
		enemy.checkWorldBounds = true;//checking for enemies in the world (variable for checking)
		enemy.outOfBoundsKill = true;//if enemies out of bound -- kill it ;O and will change the status of the enemies to be dead//helps with performance


	},

		addEnemy2: function() {
		var enemy = this.enemies.getFirstDead(); // get the first dead enemy of the group // this.enemies calls the 10 enemies from the group

		if (!enemy) { // if we do not have dead enemy -- do nothing (return)
			return;
		}

			// ------ This part initialize the enemies ------ //
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.width/2, game.height);
		enemy.body.gravity.y = -500; //gravity, 500 is positive hence falling down
		enemy.body.velocity.x = 1000 * game.rnd.pick([-1, 1]);//velocity.x means horizontal force//-1, 1 means random between these values//100 * is just increasing speed to the -1, 1 
		enemy.body.bounce.x = 1;//bounce.x means collision will bounce it to another direction in x axis /1 means perfect bounce/0 means no bounce/can put 0.5
		enemy.checkWorldBounds = true;//checking for enemies in the world (variable for checking)
		enemy.outOfBoundsKill = true;//if enemies out of bound -- kill it ;O and will change the status of the enemies to be dead//helps with performance

		
	},

			addEnemy3: function() {
		var enemy = this.enemies.getFirstDead(); // get the first dead enemy of the group // this.enemies calls the 10 enemies from the group

		if (!enemy) { // if we do not have dead enemy -- do nothing (return)
			return;
		}

			// ------ This part initialize the enemies ------ //
		enemy.anchor.setTo(0.5, 1);
		enemy.reset(game.width/2, 0);
		enemy.body.gravity.y = 500; //gravity, 500 is positive hence falling down
		enemy.body.velocity.x = 40 * game.rnd.pick([-1, 1]);//velocity.x means horizontal force//-1, 1 means random between these values//100 * is just increasing speed to the -1, 1 
		enemy.body.bounce.x = 1;//bounce.x means collision will bounce it to another direction in x axis /1 means perfect bounce/0 means no bounce/can put 0.5
		enemy.checkWorldBounds = true;//checking for enemies in the world (variable for checking)
		enemy.outOfBoundsKill = true;//if enemies out of bound -- kill it ;O and will change the status of the enemies to be dead//helps with performance

		
	},

		addMobileInput: function() {
			var jumpButton = game.add.sprite(350, 240, 'jumpButton');
			jumpButton.inputEnabled = true;
			jumpButton.alpha = 0.5;
			jumpButton.events.onInputDown.add(this.jumpPlayer, this);

			this.moveLeft = false;
			this.moveRight = false;

			var leftButton = game.add.sprite(50, 240, 'leftButton');
			leftButton.inputEnabled = true;
			leftButton.alpha = 0.5;
			leftButton.events.onInputOver.add(this.setLeftTrue, this);
			leftButton.events.onInputOut.add(this.setLeftFalse, this);
			leftButton.events.onInputDown.add(this.setLeftTrue, this);
			leftButton.events.onInputUp.add(this.setLeftFalse, this);


			var rightButton = game.add.sprite(130, 240, 'rightButton');
			rightButton.inputEnabled = true;
			rightButton.alpha = 0.5;
			rightButton.events.onInputOver.add(this.setRightTrue, this);
			rightButton.events.onInputOut.add(this.setRightFalse, this);
			rightButton.events.onInputDown.add(this.setRightTrue, this);
			rightButton.events.onInputUp.add(this.setRightFalse, this);

		},

			setLeftTrue: function() {
				this.moveLeft = true;
			},
			setLeftFalse: function() {
				this.moveLeft = false;
			},
			setRightTrue: function() {
				this.moveRight = true;
			},
			setRightFalse: function() {
				this.moveRight = false;
			},

		jumpPlayer: function() {
			if (this.player.body.onFloor()) {
				this.player.body.velocity.y = -320;
				this.jumpSound.play();
			}
		},

		orientationChange: function() {
			if (game.scale.isPortrait) {
				game.pause = true;
				this.rotateLabel.text = 'rotate your device in landscape';
			}
			else {
				game.paused = false;
				this.rotateLabel.text = '';
			}

		},



};
