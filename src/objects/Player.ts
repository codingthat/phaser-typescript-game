import Phaser from 'phaser';
import Asset from '../AssetType';

export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, Asset.hero);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setOrigin(0);
        this.setBounce(0.2);
        this.setCollideWorldBounds(true);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers(Asset.hero, { frames: [2,1,2,3] }),
            frameRate: 7,
            repeat: -1,
        });
        this.anims.create({
            key: 'wait',
            frames: [{ key: Asset.hero, frame: 0 }],
        });
    }
    public handleMovement(left: boolean, right: boolean, up: boolean): void {
        const runSpeed = 160;
        const jumpSpeed = 330;
        if (left) {
            this.setVelocityX(-runSpeed);
            this.anims.play('walk', true);
            this.flipX = true;
        } else if (right) {
            this.setVelocityX(runSpeed);
            this.anims.play('walk', true);
            this.flipX = false;
        } else {
            this.setVelocityX(0);
            this.anims.play('wait', true);
        }

        if (up && this.body!.touching.down) {
            this.setVelocityY(-jumpSpeed);
        }
    }
}
