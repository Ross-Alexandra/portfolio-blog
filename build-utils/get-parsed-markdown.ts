import fs from 'fs';
import { parse as markdownParse } from 'marked';

export function getParsedMarkdown(pagePath: string) {
    if (!pagePath || !pagePath.includes('blogs')) return {};

    const markdownPathName = pagePath.replace('/blogs/', '').replace('/index.html', '');
    const markdownFile = `blogs/${markdownPathName}/index.md`;
    const content = fs.readFileSync(markdownFile, 'utf-8');
    const html = markdownParse(content);

    return { [markdownPathName]: html };
}
