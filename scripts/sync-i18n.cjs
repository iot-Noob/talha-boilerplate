const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/locales');
const SOURCE_FILE = path.join(LOCALES_DIR, 'en.json');

function syncObjects(source, target) {
    const synced = { ...target };
    let hasChanges = false;

    for (const key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!synced[key] || typeof synced[key] !== 'object') {
                synced[key] = {};
                hasChanges = true;
            }
            const [childSynced, childChanges] = syncObjects(source[key], synced[key]);
            synced[key] = childSynced;
            if (childChanges) hasChanges = true;
        } else {
            if (synced[key] === undefined) {
                // If it's a new key, add it from source
                synced[key] = source[key];
                hasChanges = true;
            }
        }
    }

    // Optional: Remove keys from target that don't exist in source
    for (const key in synced) {
        if (source[key] === undefined) {
            delete synced[key];
            hasChanges = true;
        }
    }

    return [synced, hasChanges];
}

function main() {
    if (!fs.existsSync(SOURCE_FILE)) {
        console.error(`Source file not found: ${SOURCE_FILE}`);
        process.exit(1);
    }

    const sourceData = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
    const files = fs.readdirSync(LOCALES_DIR);

    files.forEach(file => {
        if (file === 'en.json' || !file.endsWith('.json')) return;

        const filePath = path.join(LOCALES_DIR, file);
        const targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log(`Syncing ${file}...`);
        const [syncedData, hasChanges] = syncObjects(sourceData, targetData);

        if (hasChanges) {
            fs.writeFileSync(filePath, JSON.stringify(syncedData, null, 2), 'utf8');
            console.log(`Updated ${file}`);
        } else {
            console.log(`${file} is already in sync.`);
        }
    });

    console.log('Sync complete!');
}

main();
