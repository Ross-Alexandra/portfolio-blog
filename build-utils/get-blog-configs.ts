import glob from 'fast-glob';
import { readFileSync } from 'fs';

export function getBlogConfigs() {
    const configFiles = glob.sync('blogs/**/config.json');

    const configs = configFiles.map((configFile) => {
        const config = JSON.parse(readFileSync(configFile, 'utf-8'));
        return config;
    });

    return configs;
}
