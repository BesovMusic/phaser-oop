import Phaser from 'phaser';

export default class gameOverScene extends Phaser.Scene {
	constructor() {
		super('gameOverScene');
	}

	init(data) {
		this.score = data.score;
	}

	preload() {
		this.screenMiddleX = this.game.config.width * 0.5;
		this.screenMiddleY = this.game.config.height * 0.5;
	}

	create() {
		this.add.image(400, 300, 'sky');
		this.gameOverText = this.add
			.text(
				this.screenMiddleX,
				this.screenMiddleY,
				'Game over! Your score: ' + this.score,
				{
					fontSize: '36px',
				}
			)
			.setOrigin(0.5);

		this.restartButton = this.add
			.text(this.screenMiddleX, this.screenMiddleY + 50, 'RESTART', {
				fontSize: '40px',
			})
			.setOrigin(0.5);

		this.restartButton.setInteractive();
		this.restartButton.on('pointerup', () => this.scene.start('gameScene'));
	}
}
