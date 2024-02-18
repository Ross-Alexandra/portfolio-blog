export * from './components/_global-components';

type PostTypes = 'all' | 'exploration' | 'debrief' | 'other';

window.addEventListener('load', () => {
    const filtersWrapper = document.querySelector('.filters');
    const postsWrapper = document.querySelector('.posts');
    const buttons = document.querySelectorAll('.filters > button');

    // For mobile support, if the user clicks the filters wrapper, then we
    // want to treat it like they clicked the currently active filter button
    filtersWrapper?.addEventListener('click', (event) => {
        if (event.target !== filtersWrapper) return;

        const activeButton = filtersWrapper.querySelector('button[aria-pressed="true"]');
        activeButton?.dispatchEvent(new Event('click'));
    });

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const isActive = button.getAttribute('aria-pressed') === 'true';
            if (!isActive) {
                const type = button.getAttribute('data-post-filter') as PostTypes;

                buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'));
                button.setAttribute('aria-pressed', 'true');

                // Close the mobile filters if they are open
                filtersWrapper?.setAttribute('data-mobile-expanded', 'false');

                filterPosts(type);
            } else {
                const isExpanded = filtersWrapper?.getAttribute('data-mobile-expanded') === 'true';
                filtersWrapper?.setAttribute('data-mobile-expanded', isExpanded ? 'false' : 'true');
            }
        });
    });

    function filterPosts(type: PostTypes) {
        if (!postsWrapper) return;

        const posts = postsWrapper.querySelectorAll('.post');
        posts.forEach((post) => {
            const postType = post.getAttribute('data-post-type') as PostTypes;
            if (type === 'all' || postType === type) {
                post.setAttribute('data-hidden', 'false');
            } else {
                post.setAttribute('data-hidden', 'true');
            }
        });
    }
});
