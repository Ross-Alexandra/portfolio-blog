# Snippets: Web Components with Vite
While working on this blog, I wanted to create some custom web components which
I could display in my blog posts. A restriction I set on this blog was trying to
keep the number of *runtime* dependencies to a minimum. This meant that I didn't
want to use a framework like React or Vue to create my web components, and instead
I wanted to use vanilla Web Components.

If you've ever written a web component, then you'll know that a lot of tutorials
will recommend you write the html for your component directly in the component's
javascript file using a template literal. Something like this:

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <style>
        /* Your component's styles here */
      </style>
      <div>
        <!-- Your component's html here -->
      </div>
    `;
  }
}
```

While this is totally fine, I wanted to
be able to write the html for my components in a dedicated html file, and then import
that html file into my component's javascript file. This is where Vite comes in.

Originally, and after a bit of searching, I found a lot of resources suggesting
that you could use the `import` statement to import html files into your javascript
files. However, the primary issue with this is that the `import` statement was
a runtime feature. This meant needing to asynchronously fetch the html file at
runtime, which was something I wanted to avoid. I wanted to have the power of
importing html files into my javascript files, but I wanted to do it at build time.

This is where Vite comes in. Vite has a configuration option called `assetsInclude`.
This option allows you to specify a glob which will match any files
that you want to include in your build, and allow you to import them into your
javascript files like: `import myHtml from './myHtml.html?raw'`. The `?raw` query
string is a Vite feature which tells Vite to import the file as a string, rather
than as a module, and means that the file will be included as-is in the build.

Here's how I set up my Vite config to include html files in my build:

```javascript
// vite.config.js
export default {
  assetsInclude: [
    'src/components/**/*.html',
  ],
};
```

With this configuration, I was able to import my html files into my javascript
files, and then use them to create my web components. Here's an example of how
I did this:

```javascript
// src/components/my-component.js
import myHtml from './my-component.html?raw';

class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = myHtml;
  }
}
```

Finally, after building the project, we could see in the compiled bundle that
the html file was included as a string in the javascript file:
    
```javascript
// dist/some-hash.js
...
const bn=`<div>
    <p>I am a custom component!</p>
</div>`;
...
```
