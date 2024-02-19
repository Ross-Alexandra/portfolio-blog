import { getBlogConfigs } from './get-blog-configs';
import { getParsedMarkdown } from './get-parsed-markdown';

export function getHandlebarsConfig(entry: string) {
    return {
        ...getParsedMarkdown(entry),
        config: {
            posts: getBlogConfigs(),
        },
    };
}
