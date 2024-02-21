# Why use a framework?
In this article, I'm going to explore the reason why I decided to build this
blog-site without using a framework, what I intended to learn from the experience,
what trip-falls I encountered, and ultimately, what I learned from the experience.

Quick aside: Generally I'd put the *plan, & intended learnings* into a separate
article under the *Tech Exploration Plans* category, but I'm going to skip that 
here because I've already written the blog-site and writing about my plans now
would be a bit disingenuous. Instead, in the next section, I'll talk about what
my intentions were before I started building the blog-site.

# My plans to build this blog-site from scratch
When I first started thinking about creating a blog, I had a few questions in
mind that I wanted to answer.
- What was I going to say, and
[why should I be writing it down](/blogs/intentional-practice)?, and
- What was I going to learn from the experience?

That second question really stuck in my mind. I've been writing frontends with
React since 2019, and Vue in since early 2023. Blog-sites are inherently simple,
what was I possibly going to learn from building a simple blog-site?

From there, I started to think about my experience and what I actually knew. I
could build very complex sites relatively quickly using a framework, but did I
really understand what was going on under the hood? and if I didn't, how would I
know if what I was writing was any good?

Around that time, I'd also been spending a lot of time reading & watching videos
from people who had been writing software from the opposite end of the
spectrum: the backend. There was lots of talk here about the over-use of
frameworks, and how they can lead to issues with performance, and more importantly,
maintainability. So, I decided to take a step back and see if I could build 
something simple without a framework, and what I would be trading off by doing so.

## Why *not* use a framework?
A few years ago, I would've said that not using a framework was probably a bad
idea. The development time would be longer, the code would be less maintainable,
and ultimately, the site would be stuck in the past with poor reactivity and
usability. That thought would have been a misguided one.

I'm sure that there are hundreds of analogies that already exist, spoken by
people with much more experience than I, but I'm going to use my own anyways.
When I think about using a framework, I wonder if I'm using a sledgehammer to
kill a fly; The sledgehammer is absolutely powerful enough to kill a fly, but
will the house be standing when I'm done? If a fly swatter is perfectly capable
of killing the fly, why would I need to use a sledgehammer?

I'm not sure if that analogy is perfect, but I think it gets the point across.
Frameworks are powerful. They're designed to be able to handle any problem that
you throw at them, and that means that they're very versatile, but also very complex.
If I'm building a simple blog, something which for all intents and purposes
should just be static content on a page, why should I need a framework? 

## Why not use another solution?
- Something like a static site generator would likely be a great solution for a
blog, but what would I be learning from using one? 
- Maybe I could write a backend server which hosts the articles and serves them
to the client, but ultimately, in the world of serverless, why would I need a 
server if I'm just serving static content?
- Blogs are inherently simple. Going back to the sledgehammer analogy, why would
I need anything beyond some effectively static HTML pages and a tool to build 
those?

Thus, I decided to build the site using pure HTML, CSS, and JavaScript. I also
wanted to learn about the other solutions that were available to me, and what I
would be trading off by not using a framework.

## Unique challenges
I also wanted to make sure that beyond just going outside of my comfort zone, I
was also going to be learning something new. I also wanted to do something to
make sure that this site was something that was both special to me, and also
a useful abstraction for the future.

To do this, I settled on two unique challenges for this site, which I think
will make the whole experience more interesting and useful for me.
1. I wanted to be able to write all of the articles in markdown, and have them
rendered as HTML on the site. This would not only ensure that the articles were
portable, but also that they were consistent and easy to write.
2. I wanted to build the site in a way which meant that a no javascript needed
to run before the site was usable; Again, this is a blog site, why should I need
to dynamically load anything?

# What I learned

## Markdown is great for content-ful pages
I've always liked markdown. I use it all the time when writing READMEs and 
messages on Slack & Discord, so when I thought about how I was going to write
article for this site it was a no-brainer to use it. I thought that writing
out the HTML for each individual article would be cumbersome and I also knew
that writing the articles in markdown would make them more portable and visually
consistent.

This created the first problem that I had to solve: how do I take a markdown file,
and produce it as HTML for the site? How do I do that without adding a runtime
dependency which would need to be run before the site was usable?

To solve this, I had to setup a [build process](/blogs/building-markdown-to-html-with-vite)
which would automatically scan the markdown files in the `blogs` directory and
compile those into HTML. The solution that I came up with in order to solve this
involved including a vite plugin called `vite-plugin-handlebars` which I used
as a template engine, in addition to a markdown parser called `marked`. Both
of these tools are included as dev-dependencies, and are only used during the
build process, meaning that the site is still usable without JavaScript. This makes
a great solution for the problem, as it means that during the build:
- The markdown files are parsed into HTML strings, and then
- The HTML strings are inserted into a handlebars template, and finally,
- The handlebars template is compiled into a HTML file.

This means that I get the best of both worlds: I can write the articles in markdown,
and the site is still usable without JavaScript (and compiles to straight HTML).

Overall, the simplicity of this solution is something I would absolutely reach
for in the future. In the process of making sites, I often come across the need
to include have pages which are just simple static content with no *actual*
interactivity. Additionally, markdown has full support for HTML, so if I ever
need to include something more complex, then I can just write the HTML directly
into the markdown file. 

For example, here's a simple counter widget which I wrote in a Vanilla web
component, and included in the markdown for this article like so:
```html
<x-counter></x-counter>
```
<x-counter></x-counter>

*Speaking of web components...*

## Templates are a much better go-to, but can't beat the generality of web components
A question I needed to answer for myself once I started building the site was 
where the boundary was between a template and a web component. I knew that I
wanted to build the site without a framework, and I knew that if I was going to
have reusable components, I would need to use both of these tools at some point.

To someone who's more experienced with these technologies the answer may be more
straightforward. However, since the majority of my experience is with frameworks
all I could see were nails which the hammer of web components could solve. 

Despite this, I settled on using templates for the majority of the site.
Specifically, this meant places where there was no need for interactivity,
including the header, the footer, and each of the articles. Using templates made
sense to me here: they're just repeated blocks of HTML which need to be inserted
into each page. The header has some basic javascript to handle when the user
scrolls, but other than that it's just static content. Doing it with templates
means that the content is inserted into the page at build time, meaning that
there is no need for any JavaScript to run before the site is usable.

For web components, I settled on using them for pieces of the site which either:
1. Didn't need to be included in the initial page load, or
2. Were heavily interactive and needed to be reused across the site.

Using web components in this way means that for repeated parts of the site which
are interactive, I don't need to worry about having script tags being included
with the template, and I also don't need to worry about bloating the page with
a bunch of script tags which are only used on a few pages (or worse, managing
the headache of including the script tags on each page manually). It also means
that I can write web components for my articles, and then include them in a
small bundle which gets included with each article. That's what allowed me to
include the counter widget in the markdown for this article, and have it work
without any additional setup.

I still don't know that I've found the perfect boundary, and I'm not even sure
that there is one. However, I do know that I'm a lot more comfortable with both,
and they leave me asking the question: why would I need a framework? 

## Not having a framework is an amazing way to learn how to build something *well*
My biggest takeaway from this experience to me is that not using a framework is
an excellent way to learn how to build something well. The versatility of a
framework is a double-edged sword. It's great because it means that whenever you
come across a problem, you can reach for just about any solution you can think
of, and chances are that it will work. However, that flexibility also means that
it's very easy to reach for an abstraction which will, in the long run, make the
site harder to maintain.

For example, while I was building this site, I decided I wanted to have multiple
types of articles. Since I was going to have multiple types of articles, I wanted
a way to allow users to filter the articles by type. This filter component
is very simple on desktop: it's just like a navbar with a few buttons to select
between the different types of articles. However, on mobile, there's limited
horizontal space, so I wanted to allow the filter section to be collapsible. It
should show the currently selected filter, and then when the user taps on it,
it should expand to show the other filters.

Before I implemented the mobile version, the filter section was fairly simple:
```html
<div class="filters">
    <button data-post-filter="all" aria-pressed="true">All Posts</button>
    <button data-post-filter="exploration" aria-pressed="false">Tech Exploration Plans</button>
    <button data-post-filter="debrief" aria-pressed="false">Tech Debriefs</button>
    <button data-post-filter="other" aria-pressed="false">Code &amp; Musings</button>
</div>
```

The html for the filter section controls the state of the filter; if a button
has the `aria-pressed` attribute set to `true`, then it's the currently selected
filter. From there, a small amount of CSS is used to add an underline to the
currently selected filter. Additionally, a small amount of JS is the glue that
sticks everything together:
```javascript
const postsWrapper = document.querySelector('.posts');
const buttons = document.querySelectorAll('.filters > button');

buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const isActive = button.getAttribute('aria-pressed') === 'true';
        if (!isActive) {
            const type = button.getAttribute('data-post-filter') as PostTypes;

            buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
            button.setAttribute('aria-pressed', 'true');

            filterPosts(type);
        }
    });
});
```

The `data-post-filter` attribute is used to determine which type of article
should be shown, and the `aria-pressed` attribute is toggled on click.

This solution is simple and great, it's also fairly rigid. So when I later came
to implement the mobile version, I had a problem: How do I make the filters
section collapsible, and how do I make it so that the currently selected filter
is always visible?

With a framework, there's lots of easy answers. I could put a listener on the
window for the resize event, and then change out the filters section with another
component at mobile sizes. Alternatively, I could relatively easily inject some
CSS into the components with javascript to make the filters section collapsible.
The problem is that all of these solutions are almost certainly overkill for the
problem at hand. There shouldn't be a reason why the collapsible filters section
*shouldn't* need to be 4 `button`s in a `div`. 

However, since I didn't have access to a framework, I had to think about the
underlying state of the filters section, and what I *really* needed to make
it work. In the end I settled on a solution which, at the cost of some slightly
more complex CSS, was significantly simpler and easier to maintain. The only change
to the HTML was to add a stateful `data-mobile-expanded` attribute to the filters
`div`, and then update the JS to toggle that attribute on click. This came out to:
```html
<div class="filters" data-mobile-expanded="false">
    <!-- ... No changes to the buttons ... -->
</div>
```

```javascript
    const filtersWrapper = document.querySelector('.filters');
    /// ... No changes to the other selectors ...

    // For mobile support, if the user clicks the filters wrapper, then we
    // want to treat it like they clicked the currently active filter button
    filtersWrapper?.addEventListener('click', (event) => {
        if (event.target !== filtersWrapper) return;

        const activeButton = filtersWrapper.querySelector('button[aria-pressed="true"]');
        activeButton?.dispatchEvent(new Event('click'));
    });

    // Add the same listeners to the buttons as before
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const isActive = button.getAttribute('aria-pressed') === 'true';
            if (!isActive) {

                // ... and if the clicked button is inactive, update the state in the same way ...

                // Close the mobile filters if they are open
                filtersWrapper?.setAttribute('data-mobile-expanded', 'false');

                // ... and filter the posts ...

            // Finally, if the user clicked on this button and the filters were
            // already open, then just collapse them!
            } else {
                const isExpanded = filtersWrapper?.getAttribute('data-mobile-expanded') === 'true';
                filtersWrapper?.setAttribute('data-mobile-expanded', isExpanded ? 'false' : 'true');
            }
        });
    });
```

In exchange for a couple extra lines of JS to manage the state of whether the
section is expanded and a new listener to ensure that the whole section is
clickable, I was able to get a solution which was essentially the same as the
desktop version! To me, this really feels like the *right* solution here; the
state is still wholly stored in the HTML and there's a very small layer of JS to
update that state when the user interacts with the page. The CSS is more
complex, but ultimately, I think that's a wonderful tradeoff here. The HTML
perfectly describes the state of the filters section, the additional CSS is just
a small layer of polish to animate between the states.

Before ending this section, I really want to emphasize how *cool* it is that the
HTML is the source of truth here. Generally, when working with a framework, the
same solution here would have you create a stateful variable which would then
be injected into the component; inverting the source of truth. This means that
the state of the filters section is now held in JS-land, and the HTML is just
a reflection of that state. This in turn means that accessing this state means
that you need to reach for much more complex solutions, such as state management.
Instead, an event listener and some state kept exactly where it needs to be is
all that's needed to make this work. Perhaps on a much larger site, this would
begin to break down, but for *this* site, it's perfect.

This is a very small example, but I think it illustrates the point well. The
versatility of a framework is great, and in the end it absolutely would have
saved me time to be able to reach for the first solution that came to mind.
However, being restricted to just the tools that I had available to me meant
that I had to think about and understand the problem more deeply, and in the
end, I think I came out with a better solution.

## Why use a framework?
That leads me to the reason why I'm so conflicted while writing this article.
I've learned a lot from building this admittedly simple site without a framework,
and I think that I've come out with a better understanding of how to build
things well (and the power of just using raw HTML instead of leaning on reactivity).

This project also lead me to realize that there is *a lot* of complexity which
gets abstracted away when using a framework. Half of this article is basically
me building my own ideas of how I should structure the site and how I should
build the components. While I think that's very valuable, I also realize that
I'm kind of just reinventing a framework which is *far* less battle-tested than
the ones which are already out there. Instead of using a framework's component
to handle templating and reactivity and using code to represent state, I'm burying
that state in the HTML and using a small amount of JS to manage it. **This isn't
necessarily a bad thing though**, it's just a different way of doing things from
what I'm used to.

So back to the question: why use a framework? I think that the answer is that
it's a trade-off. If I need to build something quickly, then in my experience
a framework is the way to go. It's going to hold my hand and make sure that the
first solution that comes to mind is probably going to work. However, if I want
to build something well, something which will allow me to dip into the framework
when I need to, but also allows me to build simple things simply, then I think
that not using a framework might just be the way to go.

That said, I'm new to this. I've been building things with code since I was in
the 8th grade, and I've been writing frontends with frameworks since 2019, but
this is my first *real* time building something larger [than a simple browser
extension](https://github.com/Ross-Alexandra/Search-the-py-docs-extension) on
the web without a framework (and I built that back before I'd built *anything*
on the web). This is something I *want* to explore more, because I think that
this brief dip into the world of building without a framework has been
incredibly valuable.

# Next steps
I want to explore the world of building without a framework more.
While I did *enjoy* my time using Vite to just build some simple HTML, I think
that I want to build something a little more complex. Something which will need
a server, and something which will need to be more interactive. 
My plan for my next steps is to re-implement a site I've already built, but
using HTMX and server-side rendering instead of a framework. I think that 
will be a great way to explore my interests here, and to really hear out the
idea that HTML should be the source of truth for the web (as opposed to some
state held in JS-land). If you're interested in hearing about my plans for that,
then read my next article:
[HTMX: my next step into frameworkless web development](/blogs/htmx-my-next-step-into-frameworkless).
