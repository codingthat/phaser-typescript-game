const assetNames = [
    'ghostStar',
    'grass',
    'hero',
    'sky',
    'star',
] as const;

type AssetName = typeof assetNames[number];
const Asset = Object.fromEntries(assetNames.map(name => [name, name])) as {
    [K in AssetName]: K;
};
export default Asset;