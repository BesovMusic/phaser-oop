import Phaser from 'phaser';

export default class gameOverScene extends Phaser.Scene {
	constructor() {
		super('gameOverScene');
		this.bestScore = 0;
	}

	init(data) {
		this.score = data.score;
		if (this.score > this.bestScore) {
			this.bestScore = this.score;
		}
	}

	preload() {
		this.screenMiddleX = this.game.config.width * 0.5;
		this.screenMiddleY = this.game.config.height * 0.5;
	}

	create() {
		this.add.image(400, 300, 'sky');

		this.bestScoreText = this.add
			.text(
				this.screenMiddleX,
				this.screenMiddleY - 150,
				'Best score: ' + this.bestScore,
				{
					fontSize: '36px',
				}
			)
			.setOrigin(0.5);
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
			.text(this.screenMiddleX, this.screenMiddleY + 100, 'RESTART', {
				fontSize: '40px',
			})
			.setOrigin(0.5);

		this.restartButton.setInteractive();
		this.restartButton.on('pointerup', () => this.scene.start('gameScene'));
	}
}
