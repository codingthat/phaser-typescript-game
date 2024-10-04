import Phaser from 'phaser';
import Player from '../objects/Player';
import Asset from '../AssetType';

type ArcadePhysicsCallback = Phaser.Types.Physics.Arcade.ArcadePhysicsCallback;
type Group = Phaser.Physics.Arcade.Group;
type Image = Phaser.Physics.Arcade.Image;
type Text = Phaser.GameObjects.Text;

const IntBetween = Phaser.Math.Between;

export default class GameScene extends Phaser.Scene {
    private player: Player;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private fpsText: Text;
    private stars: Group;
    private ghostStars: Group;
    private scoreText: Text;
    private buttonSize = 160 as const;

    constructor() {
        super({ key: 'GameScene' });
    }

    create(): void {
        this.add.image(0, 0, Asset.sky).setOrigin(0);

        const groundHeight = this.buttonSize * 1.25;
        const groundTop = this.scale.height - groundHeight;
        const platforms = this.physics.add.staticGroup();
        platforms.add(
            this.add.tileSprite(0, groundTop, this.scale.width, groundHeight, Asset.grass)
            .setOrigin(0)
        );
        const platformXYs: Array<[number, number, number?]> = [
            [0, 14],
            [0, 5],
            [7, 9],
            [20, 4],
            [27, 7, 2],
            [28, 10],
        ];
        const platformUnitWidth = 30;
        const platformDefaultUnits = this.textures.get(Asset.grass).getSourceImage().width / platformUnitWidth;
        for (const platformXY of platformXYs) {
            platforms.add(this.add.tileSprite(
                platformXY[0] * platformUnitWidth,
                groundTop - platformXY[1] * platformUnitWidth,
                (platformXY[2] ?? platformDefaultUnits) * platformUnitWidth,
                0,
                Asset.grass
            ).setOrigin(0));
        }

        this.scoreText = this.add.text(this.scale.width/2, 0, '', { fontSize: '32px', backgroundColor: '#000' }).setOrigin(0.5, 0);
        this.player = new Player(this, 0, groundTop - this.textures.getFrame(Asset.hero, 0).height, this.scoreText);
        this.physics.add.collider(this.player, platforms);

        const starCount = 100;
        this.stars = this.physics.add.group({
            key: Asset.star,
            repeat: starCount - 1,
            gridAlign: { cellWidth: this.scale.width / starCount },
            setOrigin: {x: 0, y: 0},
        });
        this.stars.children.getArray().forEach((star) => {
            (star as Image).setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.stars, platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

        this.ghostStars = this.physics.add.group();
        this.ghostStars.defaults.setMaxSpeed = 2000;
        this.physics.add.collider(this.ghostStars, platforms);
        this.physics.add.collider(this.player, this.ghostStars, this.hitGhostStar, undefined, this);

        this.fpsText = this.add.text(10, 10, '', {
            color: '#00ff00'
        });

        this.cursors = this.input.keyboard!.createCursorKeys();
        if (this.input.manager.touch) {
            this.createMobileControls();
        }
    }

    update(): void {
        this.fpsText.setText('FPS: ' + Math.floor(this.sys.game.loop.actualFps));
        this.player.handleMovement(this.cursors.left.isDown, this.cursors.right.isDown, this.cursors.up.isDown);
    }

    private collectStar: ArcadePhysicsCallback = (object1, object2) => {
        const player = object1 as Player;
        const star = object2 as Image;
        star.disableBody(true, true);

        player.score += 10;
        const playerSpeedBoostFactor = 3;
        player.setVelocity(
            this.player.body!.velocity.x * playerSpeedBoostFactor,
            -Math.abs(this.player.body!.velocity.y * playerSpeedBoostFactor)
        );

        if (this.stars.countActive(true) === 0) {
            this.stars.getChildren().forEach((star) => {
                (star as Image).enableBody(true, star.body?.position.x, 0, true, true);
            });
            const half = this.scale.width / 2;
            const x = (this.player.x < half) ? IntBetween(half, this.scale.width) : IntBetween(0, half);
            const ghostStar = this.ghostStars.create(x, 16, Asset.ghostStar) as Image;
            ghostStar.setBounce(1);
            ghostStar.setCollideWorldBounds(true);
            ghostStar.setVelocity(IntBetween(-200, 200), 20);
        }
    }

    private hitGhostStar: ArcadePhysicsCallback = (object1, _object2) => {
        const player = object1 as Player;
        if (player.score > 0) {
            player.stunned = true;
        } else {
            player.dead = true;
            this.physics.pause();
        }
    }

    private createMobileControls(): void {
        const buttonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            color: 'black',
            fontSize: '100px',
            fixedHeight: this.buttonSize,
            fixedWidth: this.buttonSize,
            align: 'center',
        };

        const addButton = (symbol: string, cursorKey: Phaser.Input.Keyboard.Key, backgroundColor: string, x: number) => {
            function fakeKeyboardState(isDown: boolean): void {
                cursorKey.isDown = isDown;
            }
            this.add.text(x, this.scale.height - this.buttonSize, symbol, Object.assign(buttonStyle, { backgroundColor }))
                .setInteractive()
                .on('pointerdown', () => fakeKeyboardState(true))
                .on('pointerup', () => fakeKeyboardState(false))
                .on('pointerout', () => fakeKeyboardState(false));
        }    
        addButton('←', this.cursors.left, 'lightgreen', 0);
        addButton('→', this.cursors.right, 'skyblue', this.buttonSize);
        addButton('↑', this.cursors.up, 'pink', this.scale.width - this.buttonSize);

        this.input.addPointer(1); // Enable multitouch
    }
}
