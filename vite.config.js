import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import glob from 'fast-glob';

/**
 * Configures the dev server to redirect requests with a trailing slash to the
 * same URL without the trailing slash. This is to ensure that the development
 * server behaves the same way as the production server, which should be trailing
 * slash agnostic.
 */
function noTrailingSlashPlugin() {
    return {
        name: 'no-trailing-slash',
        configureServer(server) {
            return () => {
                server.middlewares.use((req, res, next) => {
                    if (req.originalUrl.endsWith('/') && req.originalUrl !== '/') {
                        res.writeHead(301, {
                            Location: req.originalUrl.slice(0, -1)
                        });
                        res.end();
                    } else {
                        next();
                    }
                });
            };
        }
    };
}

/**
 * Configures the dev server to use the 404.html file as the response for all
 * requests that don't match any other file. This is to ensure that the development
 * server behaves the same way as the production server, which should return the
 * 404.html file for all requests that don't match any other file.
 */
function notFoundPlugin() {
    return {
        name: 'not-found',
        configureServer(server) {
            return () => {
                server.middlewares.use((req, res, next) => {
                    if (!res.req.url.endsWith('.html')) {
                        res.writeHead(301, {
                            Location: '/not-found',
                        });
                        res.end();
                    } else {
                        next();
                    }
                });
            };
        }
    };

}

const blogs = glob.sync('blogs/**/*.html');
const blogEntries = Object.fromEntries(blogs.map((blog) => {
    return [blog.replace('blogs/', '').replace('.html', ''), blog];
}));

export default {
    // Don't allow vite to redirect to index.html when a 404 is encountered
    // because we want to handle 404s ourselves.
    appType: 'mpa', 
    plugins: [
        // https://github.com/alexlafroscia/vite-plugin-handlebars
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
        }),
        noTrailingSlashPlugin(),
        notFoundPlugin(),
    ],
    assetsInclude: [
        // This allows us to import the HTML files in the web components
        // directly as strings, so that we can use them as templates.
        // When the site is built, these strings will be inlined into the
        // JavaScript files, so that we don't need to make any additional
        // requests to the server to get the HTML files.
        'src/components/**/*.html',
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                notFound: resolve(__dirname, 'not-found.html'),
                ...blogEntries,
            },
        }
    }
};
