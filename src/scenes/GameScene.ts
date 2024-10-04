import Phaser from 'phaser';
import Player from '../objects/Player';

type Text = Phaser.GameObjects.Text;


export default class GameScene extends Phaser.Scene {
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private fpsText: Text;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.player = new Player(this, 0, 0);

        this.fpsText = this.add.text(10, 10, '', {
            color: '#00ff00'
        });

        this.cursors = this.input.keyboard!.createCursorKeys();
    }

    update(): void {
        this.fpsText.setText('FPS: ' + Math.floor(this.sys.game.loop.actualFps));
        this.player.handleMovement(this.cursors.left.isDown, this.cursors.right.isDown, this.cursors.up.isDown);
    }
}
