import Phaser from 'phaser';
import Asset from '../AssetType';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    private _score: number;
    private _stunned = false;
    private _invincible = false;
    private _dead = false;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        private scoreText: Phaser.GameObjects.Text,
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
        this.score = 0;
        this.setMaxVelocity(5000, 5000);
    }
    public get score(): number { return this._score; }
    public set score(newValue: number) {
        this._score = newValue;
        this.scoreText.setText('Score: ' + this._score);
    }
    public get stunned(): boolean { return this._stunned; }
    public set stunned(newValue: boolean) {
        if (newValue) {
            if (!this._stunned) {
                this.score -= 10;
                const playerSpeedBoostFactor = -5;
                this.setVelocity(
                    this.body!.velocity.x*playerSpeedBoostFactor,
                    this.body!.velocity.y*playerSpeedBoostFactor
                );
                this.scene.time.delayedCall(1000, () => {
                    this.stunned = false;
                });
            }
        }
        this.invincible = newValue;
        this._stunned = newValue;
    }
    public get invincible(): boolean { return this._invincible; }
    public set invincible(newValue: boolean) {
        if (newValue) {
            this.setTint(0xff0000);
        } else if (!this.dead) {
            this.clearTint();
        }
        this._invincible = newValue;        
    }
    public get dead(): boolean { return this._dead; }
    public set dead(newValue: boolean) {
        if (newValue) {
            this.setTint(0xff0000);
            this.anims.play('wait');
            this.scoreText.setText('Game over!');
        }
        this._dead = newValue;
    }
    public handleMovement(left: boolean, right: boolean, up: boolean): void {
        if (this.dead) { return; }
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