# Building an IP Lookup Tool with HTMX and Symfony
This post is a follow-up to my previous post talking about how I wanted to
[try out HTMX & PHP](/blogs/htmx-my-next-step-into-frameworkless). In that post,
I talk about wanting to build a simple web application using HTMX (to feel out
the ergonomics of the library), and PHP with Twig (because it's the stack
the backend team my company uses and I'd like to get more familiar with it).

In this post, I'll be talking about the application I built: an IP lookup tool
using Symfony & HTMX which I called [locatify](https://locatify.rossalexandra.com).
More specifically, I'll be talking about the process of building the application,
what I learned, and what I will do differently on my next project. If you're
ever curious about the code, you can find it on my [GitHub](https://github.com/Ross-Alexandra/locatify/).

If this is your first time reading a blog post of mine, you might find the focus
a little strange; [the reason for this blog](https://blog.rossalexandra.com/blogs/intentional-practice/)
is to explicitly document my learnings from the projects I'm working on, as I am
a strong believer in the power of intentional practice.

## The Application
The application is a simple IP lookup tool. You enter an IP address (or a list
of IP addresses, or upload a csv file with IP addresses), and the application
will return the location of the IP address(es). The application uses the
MaxMind GeoLite2 database to get the location of the IP address(es).

The application is built using Symfony 5 (with Twig for templating) and HTMX
to handle server-requesting and updating the page (more about this later).
For regular non-server interactions, I use vanilla JavaScript on top of HTMX
event-handling to make the app accessible and user-friendly.

## Small lessons learned along the way
The answer to a lot of these problems that I encountered would simply be that
I'm inexperienced with using these tools. Realistically, a lot of this is
just skill-issues that will be resolved with time and practice. However, I
think it's important to document these issues and the solutions *I* came up with
and found along the way; it's possible that I've gone down some very wrong paths,
or that I've missed the obvious solution to a problem. In either case, learning
is a journey, and the point of these posts is to document that journey.

That is to say: If you like the solutions I've come up with, great! If you think
I'm doing something wrong, then it's very possible that you're right and hopefully
by the time you're reading this, I've learned a better way to do things.

### Getting PHP working the first time was confusing
A lot of the languages I generally work with have very quick & easy setups; 
I `apt install` the language, and I'm generally good to go. PHP, though simple
to install, was a bit more confusing once I was trying to get it to work with
Symfony. I had to install a few PHP extensions, and I couldn't find an obvious
way to do this. A lot of the time, when searching for these extensions, I would
be brought to PHP documentation which told me that they should *already* be
installed. Eventually, I found that I could generally install these extensions
using `apt install php-<extension-name>` or `apt install php<version>-<extension-name>`.

Though this was a bit of a pain, it's fairly easy to write this off as it's a
one-time setup cost. Though I'd like to see this process streamlined, it's not
a huge deal (nor something I'd know how to help with). I could definitely see
someone who's newer to programming getting frustrated with this process though.

### Static Javascript files can quickly become a mess
From the outset of the project, I realized that I was a bit in over my head.
I had a small chunk of the application that needed to be very interactive, and
going into the project I had expected to just handle this with HTMX. However,
I quickly realized (and I'll talk about this in the next section) that using
HTMX for all interactivity was going to make the site feel sluggish. Because of
this, I realized that I needed to use JS to handle some of the interactivity.

#### The initial problem
As I was adding more interactivity to the site, I realized that I was adding more
and more JS to the page. Before long, I had JS files for each of the input forms,
one for the whole search page in general (which was setting up event listeners
on button on page load) and a small one for the results page. I also had a JS
file for a Web Component I was using to handle the groups of inputs for the IP
addresses. This was getting out of hand.

#### HTMX event triggers & listeners to the rescue
After reading more documentation about HTMX, I realized that it had built-in
support for event triggers and listeners. This was a game-changer for me.

Originally, the web component which I had written was using custom attributes which
were being set with query selectors for various elements on the page (more about
this web component in the key takeaways section). This was a bit of a pain to
maintain, and overall *felt* like a bad solution. A much better solution however,
was to use event handling. This meant that the web component no longer needed to
setup event listeners on page load (based on the selectors in its attributes),
and instead could manipulate the page based on events being fired on the page.

This also meant that the individual buttons on the page could be setup to fire
events on the web component. This could certainly be done with vanilla JS, but
having built-in utilities to quickly and succinctly setup these events was a
nice feature of HTMX. 

Example:
```html
<button
    hx-on:click="htmx.trigger('x-web-component', 'add-ip')"
>
    Add IP Address
</button>
```

I ended up removing *most* of the JS I had written in exchange for event handlers
& triggers in HTMX. Co-locating the event handlers within the HTML for small
interactions (like disabling a button) meant that I could keep one file open
and quickly see how the page was being manipulated a lot of the time. It also meant
that organizing my JS was a lot easier as the only JS that was needed was for
the more complex interactions (which were much rarer).

#### Questions left unanswered
- How do I organize my static assets such that it is easy to find the functions
I need? For a small project like this having each component have its own folder
for JS & CSS is fine, but what about larger projects where co-location becomes
more important?
- When all of my Javascript is statically served on the page, how can I tell
which functions are being used and more importantly where they're coming from?

The answer to these questions seems straightforward to me: find a way to bundle
the templates, CSS, and JS for each component together. A default setup using
Twig with Symfony has a `templates` folder which contains all of the Twig templates
and an `assets` folder which contains all of the static assets. This means that
by design the HTML is separated from the CSS & JS. It also means that the CSS &
JS need to be linked to the HTML in some way. This is something I'd like to explore
being able to do more in the future.

### HTMX is a powerful tool, but it's important to not treat it as a silver bullet
If all interactivity is handled by HTMX, the site is likely going to feel
sluggish. This is because HTMX is making requests to the server for every
interaction. For interactions which would already need to make a request to
the server (like looking up an IP address), this is fine. However, for interactions
which don't need to make a request (like clicking a button to dynamically add
a new input field), this is going to feel slow.

This may be counter to the way that most developers use HTMX, but I think that
using HTMX for interactions which could be handled client-side is a misuse of
the library. HTMX is a powerful tool for ensuring that your application isn't 
tangling up the client-side and server-side state, but in my opinion it shouldn't
be treated as a silver bullet for all interactions.

Instead, I think that HTMX should be used for interactions which need to be
handled server-side. This means that the server is handling the preserved
state of the application, whereas the client is handling the transient state.
This is a powerful way to ensure that the application is always in a consistent
state, however it also implies that the client needs to be doing more work
(more on this in the key takeaways section).

The biggest takeaway from this is that I should be treating HTMX as my API
layer (and maybe using its built-in event handling utilities for simple
interactions). 

### Handling page transitions with HTMX has some unexpected challenges
Something that isn't immediately obvious when you start using HTMX is that for
every navigable route, you need to have the ability to return a full HTML page.
In other words, if you wanted to be able to route *directly* to the results page
of the IP lookup tool, you'd need to have a route which returns the full HTML
page, and another which returns just the fragment of the page which HTMX would
dynamically update the page with.

Doing this however is exceedingly straightforward, despite needing to dig
fairly deep into the documentation to find an example of how to do this.
Whenever HTMX makes a request to the server, it sends a header `HX-Request`.
This header can be used to determine whether the request is being made by
HTMX or not. If the request is being made by HTMX, you can return just the
fragment of the page which needs to be updated. If the request is not being
made by HTMX, you can return the full HTML page.

Doing this in Symfony was as easy as writing a utility function like this:
```php
class HTMXController extends AbstractController {
    private function htmxRenderPage(Request $request, $baseRoute, $data = []) {
        $isHtmx = $request->headers->get('hx-request');

        if ($isHtmx) {
            return $this->render("$baseRoute/htmx-index.html.twig", $data);
        } else {
            return $this->render("$baseRoute/index.html.twig", $data);
        }
    }

    ...

}
```

### Where should requests be processed?
In a similar vein to the above problem, I found that when doing larger chunks of
processing (like processing a file upload), it wasn't immediately obvious where
this processing should be done. Both the server and the client could handle
the processing of the file, so it felt like a matter of preference rather than
a matter of necessity.

Further complicating this, the results of this processing would later be used
in the search. This meant that my earlier rule of thumb (that HTMX should be used
for interactions where state needs to be preserved) didn't exactly apply here.

So what answer did I come up with? 

I decided to handle the processing of the file on the client. This was because
technically the server didn't have any need to know about the file upload until
the user was ready to search. A user could upload a file, and then choose to 
manually look up different IP addresses. This meant that the state was more likely
to be transient than preserved, and so it made more sense to handle the processing
on the client.

The point of this example is not to indicate that file processing should always
be done on the client, nor that file uploading will *always* be a transient process.
Instead, it's to show that there is a lot of nuance in deciding where to handle
different parts of the application logic, and that it's important to think about
the implications of where you're handling this logic. It's also to show that
a tool like HTMX can *absolutely* be used in a way that muddies the waters between
client-side and server-side state.

I initially chose to use HTMX because I wanted to keep the client-side transient
state separate from the server-side preserved state. However, in this example,
it shows that HTMX is a double edged sword: it *can* be used to keep the preserved
state off of the client, but it could also be used to keep transient state on
the server. Allowing greater flexibility in where the state is kept means that
the developer (me!) has more rope to potentially hang themselves with, but it also
means that the developer has the power to keep those states separate.

### Typing isn't preserved from the JS bundle to the HTML by default
This is a small issue, and one that I touched on briefly in the section about
static JS files becoming a mess. When I was writing the JS for the application,
I realized that I was missing a lot of the benefits of TypeScript, and really
just the benefits of typing in general. This was because the JS was being served
statically, so my editor had no way of inferring the types of the functions I
was using in the HTML. 

This is an issue that I'm confident has a solution, but with the small amount
of JS I had to write for this project, I didn't run into an issue where I needed
to solve this problem. However, I can see this becoming a problem in the future
if I'm writing more JS for a project.

### PHP & Symfony are *way* too powerful for this project
Put simply, it felt like every time I needed to do something, either PHP or
Symfony already had a built-in way to do it. On the server-side of the IP
lookup tool, I needed to download a MaxMind database, decompress it, unzip it,
and then use it to look up the location of an IP address. When I originally built
this tool in Python, I need to bring in a few libraries and write a good chunk of
code to do this. In PHP, all I had to do was:
```php
$pharDecompress = new PharData($fileName);
$pharDecompress->decompress();

$decompressedFilename = str_replace('.gz', '', $fileName);
$extractOutFolder = str_replace('.tar.gz', '', $fileName);
$pharExtract = new PharData($decompressedFilename);
$pharExtract->extractTo($extractOutFolder);
```

Heck! It took my longer to figure out that I had to `use \PharData;` (since I was
using Symfony's `\App\Command` namespace) than it did to actually write the code
to decompress the file.

While I was debugging things in Twig, I used the `dump` function to print out
the contents of all of the variables in the template. It was then that I really
realized how little I was using Symfony. I could see all of the variables, and the
behind the scenes work that Symfony was doing. There were variables controlling
a user's sessions (this app doesn't have users), there were CSRF tokens being
generated automatically, CORS headers were just *handled* for me. Really, the
most amazing part of this whole project was that at no point did I *feel* like I
needed to build an API layer. Symfony handled the annoying setup, and HTMX handled
the interactions!

## My Key takeaway from this project
While I was working on this project, I realized that I had gone into it with
rose-colored glasses about the simplicity of using HTMX. I had thought that
I could build a simple web application using `data-attributes`, and very light
JS while leaning on the Twig templates & content fetching in HTMX to handle the
rest. However, I quickly realized that there are some interactions which are
*really* handled well using frameworks and frontend JS, so let's dig into that
further to really mine out the lessons from this problem.

### Client-side dynamic forms
If you go to [locatify](https://locatify.rossalexandra.com), you'll see that
there's a form where you can enter an IP address. If you click the (+) button,
another set of input fields will be added to the form; if you click the (-) button,
beside an input field, that input field will be removed. This is a simple
interaction and something I would absolutely expect to be on a modern web
application. However, this is something that I found had *a lot* of gotchas that
would have been exceedingly simple to handle with a framework. To explain why, we
need to go deeper.

When submitted, these forms are sent to the server to be processed. This means that
each input must have a unique name. Tangentially, in PHP, *arrays* are very similar
to JavaScript objects. This means that if you have an input field with the name
`ip[x]`, and you have another input field with the name `ip[y]`, PHP will parse
this as an array which looks like:
```php
ip = [
    'x' => 'value',
    'y' => 'value'
];
```

or in JSON:
```javascript
{
    "ip": {
        "x": "value",
        "y": "value"
    }
}
```

What this all means is that if you have a form with inputs like this:
```html
<input type="text" name="ip[0]" />
<input type="text" name="ip[1]" />
```

Then the server is going to parse those into an array of IP addresses. This is
super cool, and it means that I can just use the nature of how the web handles
form submissions to handle the request; however it also means I need to keep
track of indices in the form. This is where I ran into a lot of issues.

### A solution without a framework
As I've alluded to in previous sections, [I built a web component](https://github.com/Ross-Alexandra/locatify/blob/main/v2/assets/components/input-groups.js)
to handle the dynamic inputs on the form. This web component was responsible for
adding and removing input fields when events were fired on it. To do this, when
the component was initialized, it would first scan its children for a default
structure. This default structure would be used to clone new input fields when
the user clicked the (+) button.

From there, since all of the inputs were already being wrapped by this web
component, I could recompute the indices of the inputs whenever the user added
or removed an input. This meant that I could keep track of the indices of the
inputs, and ensure that the form was always in a valid state.

However, this was a lot of work and realistically was a bespoke solution to a
problem that has been solved many times before. This is where I think that using
a framework could have not only saved me time, but also made the code more
readable and maintainable.

### A solution with a framework
I'm going to show a solution using React, as it's the framework that the most
people reading this will likely understand.

With react, it would be fairly straightforward to build a simple component
to handle the dynamic form. This component could simply keep track of how many
inputs are being displayed, and then render the correct number of inputs.
Importantly, React needs to have unique keys for each input (which are strictly *not*
tied to the index of the input). This means that the component could be as simple
as:
```javascript
function FormComponent() {
    const [inputs, setInputs] = React.useState([0]);

    return (
        <form>
            {inputs.map((input, index) => (
                <input key={input} name={`ip[${input}]`} />
            ))}
            <button onClick={() => setInputs([...inputs, inputs.length])}>Add IP</button>
            <button onClick={() => setInputs(inputs.slice(0, -1))}>Remove IP</button>
        </form>
    );
}
```
> There may be a bug in there with the "uniqueness" of the key in `inputs`, but
> the point is that the key is not tied to the index and more importantly *how
> simple* this is when compared to my [alternative](https://github.com/Ross-Alexandra/locatify/blob/main/v2/assets/components/input-groups.js)

However, it's important to ask here:
if I'm going to use a framework anyways, why not just use the framework to
handle the whole application?

From my perspective, the answer to this question is that a *vast* majority of the
content on the page is static. The idea of "islands of interactivity" have been
around for a while now, but I think that this is a great example of where this
pattern is useful. As a web application grows, the amount of bespoke JS being
written relative to the size of a framework is going to shrink. This means to me
that most sufficiently complex web applications could *likely* benefit from
using a framework for their more complex client-side interactions while still
using a more lightweight solution for the rest of the page. This is the key point
though: a framework should be used as a tool to make your life easier, not as the
answer to all of your problems.

Additionally, I *know* that I'm not the first person to come across this idea;
while I was doing research for this project, I found a lot of articles talking
about combining HTMX with Alpine.js (for it's lightweight nature). Further, 
I couldn't help but think to myself while I was building the page how easy it
would be to just insert an anchor `div` which a framework insert itself into.
This would mean that a site could load the framework once, and then use it to
create dynamic islands on the page as needed.


The most important part to me is that this took less than 3 minutes to write.
It's 12 lines of code, and it's *simple*. Sure, it means that I need to bring
a framework into the project, but it also means that as the project grows, I
have a tool that I can use to make my life easier. The productivity and 
maintainability gains from sprinkling in a framework like this are likely going
to be worth the cost of bringing in the framework.

## Conclusion
HTMX is a great tool for allowing developers to focus on writing a good 
frontend and backend without needing to worry about the API layer. However,
it's important to remember that HTMX is not a silver bullet for all interactions.
If an interaction needs a server request (those dealing with preserved state),
then using HTMX seems like a no-brainer! and importantly, it's okay to use a
framework for more complex interactions on the transient client state.

Additionally, Not using *any* framework means that there's a lot of application
logic which needs to be encoded into the frontend and manipulated by hard-to-find
JavaScript files. It's likely that spending the time finding a way to bundle
a framework, despite the cost of bringing in that framework, is going to be worth
the productivity and maintainability gains. If your application is sufficiently
complex, then it's very possible that you could end up with net-positive bundle
size by bringing in a framework to handle the more complex interactions.
