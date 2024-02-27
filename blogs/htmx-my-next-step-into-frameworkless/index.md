# HTML: My next Step into Frameworkless
This is my first *real* tech-exploration-plan post, so in case you haven't
read my post on [why this blog exists](/blogs/intentional-practice), this post
will be focusing on my future plans for projects which I will be working on in
my spare time and what I hope to learn from them. After my really satisfying 
experience building this blog without using a framework, I have decided to take
a step further and build a few more projects without using a frontend framework
(or at least without it being the primary technology I'm using).

I have a few ideas for potential projects to work on, but that's not the focus
of this post. Instead, I want to talk about the technologies which I'm going to
use to build these projects, why I chose them, and what I hope to learn from
them.

## Technologies
### HTMX
HTMX offers a not-so-new way of building web applications. It's a library which
allows you to use HTML to build out your web application, and then use special
`hx` attributes to add interactivity to your application. Those `hx` attributes
can be used to make requests to the server, which will then return the HTML to
be inserted into the page. This is a very different way of building web 
applications compared to the traditional way of using a frontend framework to
build out your application. So why am I interested in using HTMX?

#### The idea seems very simple
At it's core, the idea presented by (my understanding of) HTMX is very simple.
You build out your application using HTML, sprinkle in some `hx` attributes to
add interactivity, and then let the server respond with the HTML which has been
hydrated with the current state of the application. I'm sure in practice there
will be rough edges here: how do you handle optimistic updates? What really *is*
client state as opposed to application state? How does the server manage to not
be overwhelmed by the number of requests being made to constantly update the
application? That's the thing though, in answering each of these questions I'm
sure that not only will I learn about HTMX and where it's strengths and
weaknesses lie, but I'll also learn about these core concepts in a way that will
allow me to apply them better with the tools that I'm already familiar with.


#### Duplicating application state seems Sisyphean
My understanding of HTMX is that it's giving me a bargain: I can build out my
application with the state wholly managed by the server, but in exchange I'm
losing access to the tools I would normally use which help me manage said state
on the client. This means that I'm going to have to either:
- Reach for a frontend framework anyways should I need to manage some set of the
application state on the client, or
- Spend a lot of time carefully designing my application in such a way that the
state never needs to be managed on the client.

In either case, I think that there's *a lot* of learning to be had here. No
matter which way I go, I'm going to need to learn how to correctly build an
application which can't rely on the client to manage the state. Even if I do
end up reaching for a framework, *I* get to be the one to decide where that
layer happens, and what level of complexity I'm willing to accept for that to 
be the case. I think that's a really interesting tradeoff to explore.

#### It's a unique way to learn about server-side rendering
A lot of the frontend world is moving towards server-side rendering, bu I have
yet to really spend a lot of time with an SSR framework. I believe that I
understand a lot of the core reasons behind why these frameworks do the things
they do, but I think that the best way to really learn about this is to build
something myself. Sure, with HTMX I'm not *really* building the whole pipeline
from the ground up, but I think that HTMX will allow me to go a layer deeper
than I would be able to with a traditional SSR framework like Next.js (something
I'm also interested in trying out in the near future).

In general, the idea of HATEOAS really resonates with me. This excerpt from the
[HTMX website](https://htmx.org/essays/hypermedia-friendly-scripting/#prime_directive)
really sums up why I'm interested in this library:
> The prime directive of an [HTMX application] is to use Hypermedia As The Engine of
Application State. A hypermedia-friendly scripting approach will follow this
directive. **Practically, this means that scripting should avoid making
non-hypermedia exchanges over the network with a server.** <br/><br/>
So, in general, hypermedia-friendly scripting should avoid the use of `fetch()`
and `XMLHttpRequest` unless the responses from the server use a hypermedia of
some sort (e.g. HTML), rather than a data API format (e.g. plain JSON). <br/><br/>
Respecting HATEOAS also means that, in general, complicated state stored in
JavaScript (rather than in the DOM) should be avoided. <br/><br/>
However, this last statement needs to be qualified: state may be stored
client-side in JavaScript so long as it is directly supporting a more
sophisticated front-end experience (e.g. widget) than pure HTML allows.

In the past few years, I've already found myself gravitating towards using
data-attributes to store basic rendering information about elements on those
elements themselves. CSS is already built to handle this kind of thing, so it
really helps avoid having your CSS depend on the state in your JavaScript. I
think that HTMX is a really interesting way to take this idea to the next level.

I think that forcing myself to build an application in this way will give me 
more tools to work with when building out web applications in the future (both
with and without frameworks). I hope that I'll be able to take the ideas that
I learn from this and apply them to the tools that I'm already familiar with.
Add onto that the fact that I'm going to be learning about server-side rendering
in a way that I haven't before, and I think that building something with HTMX
is a no-brainer.

### PHP & Twig
PHP & Twig are a set of technologies which have been around for a long time, and
are still used in a lot of places. Namely, they're used for a large portion of
the core application that I work on at my job. As a frontend developer, I don't
get to work with these technologies very often, but I think that building
something with them will give me a better understanding of the stack that I work
with every day. That said, beyond just familiarizing myself with the stack that
I work with, I think that there are other reason to use PHP & Twig for this...

#### I want to grow my experience with "backend" languages
I've been working with JavaScript for a long time. Before I started working as a
web-developer, my go-to language was Python. I really enjoyed working with
Python to solve problems which *weren't* just web development problems, and 
initially I got into web development as a way to express those solutions. I
would build a web application as a means to show off the solution that I had
come up with. I think over the years I've been moving away from that and towards
a more product-focused mindset: building a web application *is* the solution to
the problem. I think that's a really important mindset to have, but I also can't
help but remember how much I enjoyed working with Python. I think that learning
more backend languages and building out projects with them will help me to
reconnect with that mindset.

Additionally, I think that in doing so I'll be able to better understand the
tradeoffs that are made when choosing a backend language. Moreover, my only
exposures to PHP are work, and the fact that it's the butt of a lot of jokes in
the web development community. I think that it's important to understand why PHP
is still such a divisive language in the industry, and I think that building
something with it will help me to understand, not only that, but also give me
a reference point to compare other backend languages to.

#### I want to learn about backend-template rendering
I've never really worked with a backend-template rendering language before. I've
used Django in one of my previous jobs to build an application layer between
some banking protocols and a to-be web application, but this never saw me making
any templates more complex than a simple form. I think in choosing a place to
start, it's important to choose something that's not only well established, but
also something that I can find resources to learn from. Since we use PHP & Twig
at work, I think that it's a good place to start for me.

Additionally, in picking up a language I want to find something which may be
useful in the future. PHP, for all of the jokes that are made about it, is still
a very widely used language. I think that in learning PHP I'll be able to better
understand why it's still used, and if I'd want to use it in the future.

## Conclusion
I'm really excited for the projects which I'm going to start working on in the
next few weeks & months. I hope to learn a lot from them and expand my roster
of technologies that I'm comfortable working with. I'm also excited to see how
I can use these technologies to build out the ideas that I have in my head. I
plan to write about my experiences with these technologies both as I'm learning
them, and importantly as I finish the projects and can reflect on what I've
learned.
