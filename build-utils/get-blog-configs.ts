import glob from 'fast-glob';
import { readFileSync } from 'fs';

export function getBlogConfigs() {
    const configFiles = glob.sync('blogs/**/config.json');

    const configs = configFiles.map((configFile) => {
        const config = JSON.parse(readFileSync(configFile, 'utf-8'));
        return config;
    });

    configs.sort((a, b) => {
        return new Date(b.authored_on).getTime() - new Date(a.authored_on).getTime();
    });
    return configs;
}
