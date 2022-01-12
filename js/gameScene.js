import Phaser from 'phaser';

export default class gameScene extends Phaser.Scene {
	constructor() {
		super('gameScene');
		this.sight = 'right';
	}

	preload() {
		this.load.image('restart', 'assets/Restart.png');
		this.load.image('ground', 'assets/platform.png');
		this.load.image('bomb', 'assets/bomb.png');
		this.load.spritesheet('dude', 'assets/character/Idle.png', {
			frameWidth: 32,
			frameHeight: 32,
		});
		this.load.spritesheet('runR', 'assets/character/RunR.png', {
			frameWidth: 32,
			frameHeight: 32,
		});
		this.load.spritesheet('runL', 'assets/character/RunL.png', {
			frameWidth: 32,
			frameHeight: 32,
		});
		this.load.spritesheet('jumpR', 'assets/character/JumpR.png', {
			frameWidth: 32,
			frameHeight: 32,
		});
		this.load.spritesheet('jumpL', 'assets/character/JumpL.png', {
			frameWidth: 32,
			frameHeight: 32,
		});

		this.load.audio('bg-audio', 'assets/heart-of-the-sea-01.mp3');
		this.load.audio('collect', 'assets/collect.mp3');
	}

	create() {
		this.score = 0;
		this.createWorld();
		this.createPlayer();
		this.createStars();
		this.createColliders();

		this.cursors = this.input.keyboard.createCursorKeys();

		this.createAnims();

		this.menuButtonCover = this.add
			.image(780, 20, 'restart')
			.setOrigin(0.5)
			.setScale(1.5)
			.setInteractive()
			.on('pointerup', () => this.scene.start('mainMenu'));

		this.fullScreenBtn = this.add
			.rectangle(730, 20, 30, 30, 0xffffff, 1)
			.setInteractive()
			.on('pointerup', () => this.toggleFullscreen());
	}

	toggleFullscreen() {
		if (this.scale.isFullscreen) {
			this.scale.stopFullscreen();
		} else {
			this.scale.startFullscreen();
		}
	}

	createWorld() {
		this.add.image(400, 300, 'sky');

		this.platforms = this.physics.add.staticGroup();

		this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

		this.platforms.create(600, 400, 'ground');
		this.platforms.create(50, 250, 'ground');
		this.platforms.create(750, 220, 'ground');

		this.scoreText = this.add.text(10, 10, 'Score: 0', {
			fontSize: '32px',
			fill: 'black',
			fontFamily: 'Roboto',
		});

		this.bombs = this.physics.add.group();
	}

	createPlayer() {
		this.player = this.physics.add.sprite(100, 450, 'dude');
		this.player.setCollideWorldBounds(true);
		this.player.setBounce(0.2);
		this.player.body.setGravityY(300);
	}

	createStars() {
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 0, stepX: 70 },
		});

		this.stars.children.iterate(function (child) {
			child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
		});
	}

	createColliders() {
		this.physics.add.collider(this.player, this.platforms);
		this.physics.add.collider(this.stars, this.platforms);

		this.physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			null,
			this
		);

		this.physics.add.collider(this.bombs, this.platforms);

		this.physics.add.collider(
			this.player,
			this.bombs,
			this.hitBomb,
			null,
			this
		);
	}
	collectStar(player, star) {
		star.disableBody(true, true);

		this.score += 10;
		this.scoreText.setText('Score: ' + this.score);

		if (this.stars.countActive(true) === 0) {
			this.stars.children.iterate(function (child) {
				child.enableBody(true, child.x, 0, true, true);
			});

			var x =
				player.x < 400
					? Phaser.Math.Between(400, 800)
					: Phaser.Math.Between(0, 400);

			var bomb = this.bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
		}
	}
	hitBomb(player, bomb) {
		this.physics.pause();
		player.setTint(0xff0000);

		player.anims.play('turn');

		this.scoreText.visible = false;
		this.scene.start('gameOverScene', { score: this.score });
	}
	createAnims() {
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('runL', {
				start: 0,
				end: 11,
			}),
			forward: false,
			frameRate: 30,
			repeat: -1,
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('runR', {
				start: 0,
				end: 11,
			}),
			frameRate: 30,
			repeat: -1,
		});

		this.anims.create({
			key: 'turn',
			frames: this.anims.generateFrameNumbers('dude', {
				start: 0,
				end: 10,
			}),
			frameRate: 10,
			repeat: -1,
		});

		this.anims.create({
			key: 'jumpR',
			frames: [{ key: 'jumpR', frame: 0 }],
			frameRate: 20,
		});
		this.anims.create({
			key: 'jumpL',
			frames: [{ key: 'jumpL', frame: 0 }],
			frameRate: 20,
		});
	}

	update() {
		if (this.cursors.left.isDown) {
			this.sight = 'left';
			this.player.setVelocityX(-160);

			this.player.anims.play('left', true);
		} else if (this.cursors.right.isDown) {
			this.sight = 'right';
			this.player.setVelocityX(160);

			this.player.anims.play('right', true);
		} else {
			this.player.anims.play('turn', true);
			this.player.setVelocityX(0);
			// console.log(this.sight);
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-480);
		}
		if (this.cursors.right.isDown && !this.player.body.touching.down) {
			this.player.anims.play('jumpR');
		} else if (
			this.cursors.left.isDown &&
			!this.player.body.touching.down
		) {
			this.player.anims.play('jumpL');
		}
	}
}
