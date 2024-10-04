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

        for (var i = 0; i<5000; i++) {
            this.load.spritesheet(Asset.hero + i, 'assets/hero.png',
                { frameWidth: 35, frameHeight: 68 }
            );
        }
    }

    create(): void {
        
    }
}