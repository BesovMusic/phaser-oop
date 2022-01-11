import Phaser from 'phaser';

import mainMenu from './mainMenu';
import gameScene from './gameScene';
import gameOverScene from './gameOverScene';

let config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false,
		},
	},
	scene: [mainMenu, gameScene, gameOverScene],
};

const game = new Phaser.Game(config);
