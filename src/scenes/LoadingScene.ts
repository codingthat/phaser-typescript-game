import Phaser from 'phaser';
import Asset from '../AssetType';

export default class LoadingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoadingScene' });
    }

    preload(): void {
        const barWidth = this.scale.width * 0.8;
        const barHeight = this.scale.height / 20;
        const x = this.scale.width / 2 - barWidth / 2;
        const y = this.scale.height / 2 - barHeight / 2;

        const progressBox = this.add.graphics({x, y});
        progressBox.lineStyle(4, 0x00ff00); // 4px wide
        progressBox.strokeRect(0, 0, barWidth, barHeight);

        const fileText = this.add.text(x, y + barHeight, '');

        this.load.on('progress', (value: number) => {
            progressBox.fillStyle(0x00ff00);
            progressBox.fillRect(0, 0, barWidth * value, barHeight);
        });

        this.load.on('fileprogress', (file: Phaser.Loader.File) => {
            fileText.text = file.key;
        });

        this.load.on('complete', () => {
            progressBox.destroy();
        });

        const encodeSVG = (SVG: string) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(SVG);
        const skySVG = `<svg xmlns="http://www.w3.org/2000/svg"
             width="${this.scale.width}"
             height="${this.scale.height}"
             viewBox="0 0 100 100"
             preserveAspectRatio="xMidYMid slice">
            <defs>
                <radialGradient id="sunsetGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style="stop-color:rgba(255, 204, 0, 1);" />
                <stop offset="50%" style="stop-color:rgba(255, 100, 0, 1);" />
                <stop offset="100%" style="stop-color:rgba(0, 0, 0, 1);" />
                </radialGradient>
            </defs>
            <rect width="100" height="100" fill="url(#sunsetGradient)" />
            </svg>
        `;
        const starSVG = (size: number, color: string) => encodeSVG(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 50 50">
                <polygon fill="${color}" points="25,1 31,18 49,18 35,29 41,47 25,36 9,47 15,29 1,18 19,18" />
            </svg>
        `);

        this.load.image(Asset.grass, 'assets/grass.svg');
        this.load.image(Asset.sky, encodeSVG(skySVG));
        this.load.image(Asset.star, starSVG(10, 'yellow'));
        this.load.image(Asset.ghostStar, starSVG(50, '#ffffff99'));
        this.load.spritesheet(Asset.hero, 'assets/hero.png',
            { frameWidth: 35, frameHeight: 68 }
        );
    }

    create(): void {
        this.scene.start('GameScene');
    }
}