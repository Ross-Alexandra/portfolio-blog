window.addEventListener('load', () => {
    const nav = document.querySelector('nav');
    const scroller = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;

        const beyond100 = scrollTop > 100;

        scroller?.setAttribute('data-hidden', (!beyond100).toString());
        nav?.setAttribute('data-hidden', beyond100.toString());

        if (beyond100) {
            scroller?.addEventListener('click', scrollToTop);
        } else {
            scroller?.removeEventListener('click', scrollToTop);
        }
    });

    setCopyrightText();
    function setCopyrightText() {
        const footerContent = document.querySelector('footer p.copyright');
        const date = new Date();
        if (footerContent) {
            footerContent.innerHTML = `&copy; ${date.getFullYear()} Ross Alexandra`;
        }
    }

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
});
