---
title: VDOM doesn't make things fast
abstract: |
  You don't need to search hard on the internet to find someone saying that library or framework X can't be (as) fast (as React), because it doesn't use a VDOM.
  I don't think this is true and many web performance guys seem to agree.
date: 2022-01-26
tags:
  - lang:HTML
  - lang:JS
  - lang:JSX
  - tool:React
  - tool:LIT
---

React prominently popularized the concept of a VDOM, abstracting away native DOM operations and instead rendering to a JS representation of the DOM. Then you can easily diff two states of your app and calculate the minimal DOM operations needed to transfer your old DOM into the new one.
This idea comes from the reason that DOM operations are slow. This isn't completely untrue in that DOM operations are significantly slower than e.g. assigning a value to an attribute of an object. But if let's say you just want to update the string content of a greeting and for this rerender and diff your app, that becomes significantly slower.
Of course React doesn't rerender your whole DOM on every little state change, but instead tries to remember which component depends on which state, so the performance is more aligned to the size of a component and not of the whole app. This is also the reason why it's good practice in React to develop fairly small components, since they are very specific to their state.

## The contenders

The following frameworks and tools are modern and don't rely on a VDOM, while often outperforming React

- [LIT](https://lit.dev/)
- [stencil](https://stenciljs.com/)
- [Svelte](https://svelte.dev/)
- [SolidJS](https://www.solidjs.com/)

### What are non-vdom benefits?

If you don't need a VDOM, you get two factors of speedup. You don't need to ship the JS for the VDOM _(and code not shipped to the client is always the fastest to execute)_ and also during runtime you don't need to create the VDOM and diff it.

### But how do they do it?

In the following I will take LIT as an example.

LIT uses a really nice syntax based on JS template literals, so no need for JSX and you still get (IMHO) at least the same developer experience. Let's take the following LIT component as an example:

```js
import {html, LitElement} from 'lit';

export class SimpleGreeting extends LitElement {
  static properties = {
    name: {type: String},
  };

  constructor() {
    super();
    this.name = 'Somebody';
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
customElements.define('simple-greeting', SimpleGreeting);
```

The same es TS would be even more concise:

```ts
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  @property()
  name = 'Somebody';

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}
```

This gets rendered as the following HTML:

```html
<p>Hello, <!--?lit$004396212$-->World!</p>
```

As you can see, LIT injects some comment which identifies the next HTML node. That way it can easily identify which DOM node belongs to which changeable part of state and doesn't need to div anything or even touch the static parts. So to put it simple, it doesn't really matter how large your LIT component is.

#### But how does LIT know what's static and what's dynamic?

You saw those nice _baclticks_? Normally those are just strings, but if you prefix it with a name it becomes a **tagged template literal**. Those are fundamentally functions that get two arrays as inputs. The first are the static parts (outside the `${}`) and the other are the dynamic parts (inside the `${}`). There you have your solution. That way you can do minimal DOM manipulations even when you don't use a VDOM.

## So is there no place for VDOM?

No, this is not what I want to say. The way React handles components is pretty good and if you want to handle components that way, VDOm is probably the best way to do it. All I want to say is that VDOM is not some magic smoke to make things go fast and not everything that avoids it is automatically slow. You just need to weigh in if the nice things a VDOM brings you are actually worth the size and overhead of the libraries or framework.

Always keep in mind that you pay every kb going down to your user in bandwith and more importantly time. Your app can be as nice as you want, if your content takes longer to get useful than your users want to wait, it's practically worthless.
