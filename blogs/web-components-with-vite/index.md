# HTML Files in Web Components with Vite
In the journey of developing the website hosting this blog, I set out to deepen
my understanding of web technologies. The decision to forego traditional
frameworks like React or Vue was not taken lightly. It was a deliberate choice
aimed at honing my skills in web development and ensuring a lightweight digital
footprint. Blogs, by nature, offer a unique opportunity for such
experimentation. They typically require minimal JavaScript, making them 
candidates for a framework-free approach.

Yet, this minimalist approach did not mean compromising on functionality.
Despite the absence of a heavyweight framework, I was determined to leverage the
full potential of web components. This led me to the world of vanilla JavaScript
web components; a choice that aligned perfectly with my objectives. It allowed
me to maintain simplicity and control, all while delivering a modern
development experience.

Typically, when creating web components, many tutorials suggest embedding the
HTML directly within the component's JavaScript file using template literals.

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

This approach is standard and works well for many, but I had a different vision.
I preferred to maintain HTML for my components in separate files, enhancing
readability and maintainability, then importing these files into the
corresponding JavaScript.

This is where I encountered a common hurdle. The conventional wisdom suggests
using the `import` statement to bring HTML into JavaScript. However, this ran
against another fundamental goal for this website, which was to eliminate any
reliance on JavaScript for initial rendering. The essence of a blog lies in its
static content — there's no inherent need for a server or state management,
making any delay for content fetching seem unnecessary and counterintuitive.
This perspective solidified my resolve to embed HTML directly within web
components at build time, avoiding the overhead of runtime fetches. This
approach ensures that the content is ready to go as soon as the page loads,
aligning with the static nature of blog content and enhancing user experience.

Enter Vite, a modern build tool that elegantly addresses this issue. Vite offers
a feature known as `assetsInclude`, a configuration option enabling the
inclusion of specified files directly into the build. By leveraging this,
I could import HTML content as strings at build time, bypassing the limitations
of traditional methods.

Here's a snippet from my Vite configuration enabling this functionality:

```javascript
// vite.config.js
export default {
  assetsInclude: [
    'src/components/**/*.html',
  ],
};
```

With this setup, importing HTML files into JavaScript became seamless. All I
needed to do was import the `html` files using a special query parameter: `?raw`.
This query parameter tells Vite to import the file as a string, bypassing the
default behavior of importing it as a module, and looks like this: `import myHtml
from './my-component.html?raw';`. I utilized this strategy to construct my web
components, maintaining a clean separation of concerns and enhancing the
project's structure.

Here's a brief look at how I implemented this in my components:

```html
<!-- src/components/my-component.html -->
<div>
    <p>I am a custom component!</p>
</div>
```

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

Upon building the project, the magic of Vite was evident. The HTML was embedded
as a string within the JavaScript bundle, aligning perfectly with my initial
goals and streamlining the component creation process.
    
```javascript
// dist/some-hash.js
...
const bn=`<div>
    <p>I am a custom component!</p>
</div>`;
...
```

This approach allowed me to maintain a lightweight digital footprint while
leveraging the full potential of web components. It also ensured that the
content was ready to go as soon as the page loaded, aligning with the static
nature of blog content and enhancing user experience. The result was a
lightning-fast, modern, and maintainable web component-based blog, all thanks to
Vite.
