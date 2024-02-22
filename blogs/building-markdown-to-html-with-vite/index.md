# Building Markdown to HTML with Vite
As I've talked about in lots of other posts on this site, all of my blogs
are written in Markdown, and then build into HTML using Vite. This is a
pretty simple process, but it involves a few different steps so I thought
I'd write a post about it.

## Why Markdown
Markdown is a really simple way to write content. It's just plain text, with
a few simple rules to make it easy to format. No need to have special tags all
over the place making it hard to read and a pain to write. It's also really
easy to convert to HTML, since it's just a plain text format.

The biggest reason though, is that it's exceptionally portable. I can write
all of my content now, and if in the future I decide to move to a different
solution, my only constraint is that the new solution can either directly read,
or easily convert from, Markdown. 

## Creating the HTML string
For this site, I use a 2 step process to render the Markdown. First, I simply
render the Markdown into HTML using the `marked` package at build time. This
is a really simple process and looks like this:

```typescript
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
```

This function takes in the path of the html page being built. For this blog, that
probably looks something like `blogs/building-markdown-to-html-with-vite/index.html`.
It then strips out the name-part of the path, and uses that to fin the markdown
file.

Once it has the markdown file, it simply reads the content, parses it to HTML, 
and returns the result in an object. 

## Using the HTML string
As I've mentioned in other posts, I'm using a Handlebars vite plugin to render
the HTML. This means that instead of needing to write the HTML files myself and
feed them into the build process, I can just write some stub HTML files with
handlebars placeholder! This is what the HTML file for this blog looks like:

```html
<!-- blogs/building-markdown-to-html-with-vite/index.html -->
{{> blog-post content-key=building-markdown-to-html-with-vite pageTitle="Markdown to HTML with Vite" }}
```

```html
<!-- src/partials/blog-post -->
<!doctype html>
<html lang="en">
  <!-- ... -->

  <body>
    {{> header }}

    <main>
        <div id="blog" class="content">{{{ content-key }}}</div>
    </main>

    {{> footer }}
  </body>

  <!-- ... -->
</html>
```
This is where the magic of the object returned from the `getParsedMarkdown`
function comes in. The `content-key` is a which is passed into the `blog-post`, 
and it means that the HTML string returned from the `getParsedMarkdown` function
is injected into the `blog-post` partial.

And thus, with a simple `index.html` stub file, and a simple `blog-post` partial,
I can render the markdown into HTML, and build the site.

## Conclusion
This is a pretty simple process, but it's a really powerful one. It means that
I can write all of my content in a really simple, portable format, and then
render it into HTML with a simple build process. It's a really nice way to work,
and I'm really happy with how it's turned out. 
