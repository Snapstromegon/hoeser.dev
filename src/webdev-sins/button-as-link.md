---
title: Buttons are not links
abstract: |
  Time and time again I come across someone either online or in code review who uses a button instead of a link.
  Most prominently this happens in SPA contexts.
date: 2022-01-26
tags:
  - lang:HTML
  - lang:JS
  - concept:SPA
---

Last week I came across this one again. What do I talk about?

```html
<button onclick="location='/sins'">Other Page</button>
```

## What's the problem with this one?

Often, when I comment about this, the other side says that I'm normally one of the guys to push for `button` elements instead of `div` elements with custom JS.
That's completely right, but only because one element is semantic and correct in other places, it's not always the right fit.

## A better solution

Use links!

```html
<a href="/webdev-sins">Other Page</a>
```

It's so simple and works every time. It even works when your JavaScript fails to load, or is broken.
It also ensures that all your content is deep linkable.

### But I'm building a SPA...

Yeah, I bet you are, but that's about the only case where I saw people doing this.
Only because you're not wanting to do the `a` tag action, you probably should still use it, because it gives you a lot of a11y by default and is also more semantic.

### But I don't want to do a full reload...

An `a` tag is not magic. It just triggers a _click_ event which you can listen for and prevent the default on. Then you can just do what you'd do with the button anyways.

```js
const navigate = (e) => {
  e.preventDefault();
  alert(`Would navigate to: ${e.target.href}`);
  return false;
};
```

```html
<a href="/webdev-sins" onclick="navigate(event)">Other Page</a>
```

<script>
const navigate = (e) => {
  e.preventDefault();
  alert(`Would navigate to: ${e.target.href}`);
  return false;
};
</script>
<a href="/webdev-sins" onclick="navigate(event)">Other Page</a>

## To put it in a nutshell

If you want to redirect a user to a completely new view, which should be reachable from outside (e.g. via a direct deep link), you want to use an `a` tag. If it's something that only makes sense during an ongoing session or does something on the current view as it appears to the user (e.g. add something to a todo list) a `button` is fine.

If you're doing a SPA, it might be reasonable to prevent the default event handler of a link and intercept it with the logic you would tie to the button like a showed above.
