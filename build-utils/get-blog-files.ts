import glob from 'fast-glob';

export function getBlogFiles() {
    const blogs = glob.sync('blogs/**/index.html');
    const blogEntries = Object.fromEntries(blogs.map((blog) => {
        return [blog.replace('blogs/', '').replace('/index.html', ''), blog];
    }));

    return blogEntries;
}
