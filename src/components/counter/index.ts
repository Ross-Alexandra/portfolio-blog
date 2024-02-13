import elementBody from './element.html?raw';
import './style.scss';

export default class Counter extends HTMLElement {
    private count = 0;
    private counterTemplate = '';

    constructor() {
        super();
        this.innerHTML = elementBody;
        this.counterTemplate = this.querySelector('[data-role="counter"]')?.innerHTML || '';

        this.updateCounter(this.count);
    }

    private updateCounter(nextValue: number) {
        const counterElement = this.querySelector('[data-role="counter"]');
        if (counterElement) {
            counterElement.innerHTML = this.counterTemplate.replace('{{count}}', nextValue.toString());
        }
    }

    private incrementCount() {
        this.count++;
        this.updateCounter(this.count);
    }

    private decrementCount() {
        this.count--;
        this.updateCounter(this.count);
    }

    public connectedCallback() {
        this.querySelector('[data-role="increment"]')?.addEventListener('click', () => this.incrementCount());
        this.querySelector('[data-role="decrement"]')?.addEventListener('click', () => this.decrementCount());
    }

    public disconnectedCallback() {
        this.querySelector('[data-role="increment"]')?.removeEventListener('click', () => this.incrementCount());
        this.querySelector('[data-role="decrement"]')?.removeEventListener('click', () => this.decrementCount());
    }
}

customElements.define('x-counter', Counter);
