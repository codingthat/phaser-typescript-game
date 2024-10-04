import Phaser from 'phaser';
import Player from '../objects/Player';

export default class GameScene extends Phaser.Scene {
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.player = new Player(this, 0, 0);
        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update(): void {
        this.player.handleMovement(this.cursors.left.isDown, this.cursors.right.isDown, this.cursors.up.isDown);
    }
}
