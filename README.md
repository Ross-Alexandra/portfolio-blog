# My Blog
Write something here about the blog and why it exists.

## Structure
- `index.html` - The entry point for the root page of the blog.
- `src/` - Contains the source code for the blog.
    - `partials/` - Contains handlebars partials for the blog. These are used
    primarily to create templates for structural elements of the blog. If something
    needs javascript, it shouldn't go here in order to reduce the amount of
    javascript that needs to be loaded. These partials are compiled directly into
    the html, so including javascript here would mean that it would be loaded
    every time the partial is used.
    - `components/` - Contains web components for the blog. These are used to
    create reusable components. These differ from partials in that they are
    compiled into javascript and can be loaded once and used multiple times.
        - `_global-components.ts` - Contains global components that
        are used across the blog.
        - `_blog-components.ts` - Contains components that are only
        used in blog posts. These are loaded dynamically when a blog post is loaded
        to reduce the first-load time of the blog home page & of each individual
        blog post (as the globals should be cached by then).

