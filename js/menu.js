var menuState = {
	create: function() {
		game.add.image(0, 0, 'background');

		var nameLabel = game.add.text(game.width/2, -50, 'Super Coin Box', {font: '50px Arial', fill: '#ffffff'});
		nameLabel.anchor.setTo(0.5, 0.5);

		var scoreLabel = game.add.text(game.width/2, game.height/2, 'Score: ' + game.global.score, {font: '25px Arial', fill: '#ffffff'});
		scoreLabel.anchor.setTo(0.5, 0.5);

		var text;
		if (game.device.desktop){
			text = 'press the up arrow key to start';
		}
			else {
				text = 'touch the screen to start';
			}

		var startLabel = game.add.text(game.width/2, game.height-80, text, {font: '25px Arial', fill: '#ffffff'});
		startLabel.anchor.setTo(0.5, 0.5);

		var upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		upKey.onDown.add(this.start, this);

		if(!game.device.desktop){
			game.input.onDown.add(this.start, this);
		}

		game.add.tween(nameLabel).to({y: 80}, 1000).easing(Phaser.Easing.Bounce.Out).start();
		game.add.tween(startLabel).to({angle: -2}, 500).to({angle: 2}, 1000).to({angle: 0}, 500).loop().start();
	},

	start: function () {
		if (!game.device.desktop && game.input.y < 50 && game.input.x < 60) {
			return;
		}
		game.state.start('play');
	},
};