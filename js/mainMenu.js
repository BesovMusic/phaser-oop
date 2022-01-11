import Phaser from 'phaser';

export default class mainMenu extends Phaser.Scene {
	constructor() {
		super('mainMenu');
		this.stars;
	}

	preload() {
		this.load.image('sky', 'assets/sky.png');
		this.load.image('star', 'assets/star.png');
	}

	create() {
		this.add.image(400, 300, 'sky');
		let btn = this.add.circle(400, 300, 128, 0xe7c5ff, 1);
		this.add
			.text(400, 300, 'Start Game!', {
				fontSize: '45px',
				fontFamily: 'serif',
			})
			.setOrigin(0.5);
		btn.setInteractive();
		btn.on('pointerup', () => this.scene.start('gameScene'));
		// this.createStars();
	}

	createStars() {
		this.stars = this.physics.add.group({
			key: 'star',
			repeat: 11,
			setXY: { x: 12, y: 20, stepX: 70 },
		});

		this.stars.children.iterate(function (child) {
			child
				.setBounceY(1)
				.setCollideWorldBounds(true)
				.setVelocityX(Phaser.Math.Between(-200, 200));
		});
		this.physics.add.collider(this.stars);
	}
	update() {}
}
