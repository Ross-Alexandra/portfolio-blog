import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';
import { getBlogFiles } from './build-utils/get-blog-files';
import { getParsedMarkdown } from './build-utils/get-parsed-markdown';

/**
 * Configures the dev server to redirect requests without a trailing slash to the
 * same URL with the trailing slash. This is to ensure that the development
 * server behaves the same way as the production server, which should automatically
 * append a trailing slash to all URLs that don't have an extension.
 */
function appendTrailingSlash() {
    return {
        name: 'append-trailing-slash',
        configureServer(server) {
            return () => {
                server.middlewares.use((req, res, next) => {
                    const hasTrailingSlash = req.originalUrl.endsWith('/');
                    const hasExtension = /\.[^/]*$/.test(req.originalUrl);

                    if (!hasExtension && !hasTrailingSlash) {
                        res.writeHead(301, {
                            Location: req.originalUrl + '/',
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

export default {
    // Don't allow vite to redirect to index.html when a 404 is encountered
    // because we want to handle 404s ourselves.
    appType: 'mpa', 
    plugins: [
        // https://github.com/alexlafroscia/vite-plugin-handlebars
        handlebars({
            partialDirectory: resolve(__dirname, 'src/partials'),
            context: getParsedMarkdown,
        }),
        appendTrailingSlash(),
        // notFoundPlugin(),
    ],
    assetsInclude: [
        // This allows us to import the HTML files in the web components
        // directly as strings, so that we can use them as templates.
        // When the site is built, these strings will be inlined into the
        // JavaScript files, so that we don't need to make any additional
        // requests to the server to get the HTML files.
        'src/components/**/*.html',
        
        // This allows us to import the Markdown files in the web components
        // directly as strings, so that we can use them as templates.
        'blogs/**/*.md',
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                notFound: resolve(__dirname, 'not-found.html'),
                ...getBlogFiles(),
            },
        }
    }
};
