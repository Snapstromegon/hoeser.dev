---
title: Don't fake interactive areas
abstract: |
  Don't make your users click on things that are not interactive.
date: 2025-04-10
---

Again again and again I click on "buttons" just to figure out that the element that looked like a button, triggered a pointer cursor and had a hover effect, is not interactive at all. This is not only frustrating, but also makes a user feel stupid as they feel like they are doing something wrong. This is not a good user experience and you should avoid it.

## An example

Click this button:

<style>
  #demo-frustrating {
    cursor: pointer;
    background-color: var(--theme-link-color);
    color: white;
    padding: 4rem 8rem;
    max-width: 100%;
    border: none;
    border-radius: .5rem;
    display: inline-block;
    text-align: center;
  }
  #demo-frustrating:hover {
    background-color: var(--theme-color-b);
  }
  #demo-frustrating-trigger {
    cursor: pointer;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    color: white;
    font-size: 1.2rem;
  }
</style>
<div id="demo-frustrating">
  <button id="demo-frustrating-trigger">Click me</button>
</div>
<script>
  let missedClicks = 0;
  document.getElementById("demo-frustrating").addEventListener("click", function() {
    missedClicks++;
  });
  document.getElementById("demo-frustrating-trigger").addEventListener("click", function(e) {
    e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
    e.preventDefault(); // Prevent the default action of the button
    alert(`You clicked the button after ${missedClicks} missed clicks!`);
    missedClicks = 0;
    return false; // Prevent the default action of the button
  });
</script>

Were you able to make it directly? If you were, feel lucky, because in my testing not a single person was able to make it first try. Some even just assumed the button doesn't work after clicking it 2 or 3 times. If you have a button like this, you should rething how you're implementing buttons.

## Another example

:::sidenote
This demo is implemented with pure CSS and no JavaScript.
:::

In this section, select the nav item "...":

<div id="demo-tabs">
  <nav>
    <label>
      <input type="radio" name="nav" value="home" checked>
      Home
    </label>
    <label>
      <input type="radio" name="nav" value="about">
      About
    </label>
    <label>
      <input type="radio" name="nav" value="more">
      ...
    </label>
  </nav>
  <div id="demo-tabs-content">
    <section id="home" class="tab-content">
      <h2>Home</h2>
      <p>This is the home tab content.</p>
    </section>
    <section id="about" class="tab-content">
      <h2>About</h2>
      <p>This is the about tab content.</p>
    </section>
    <section id="more" class="tab-content">
      <h2>More</h2>
      <p>You did it!</p>
    </section>
  </div>
</div>

<style>
  #demo-tabs {
    display: flex;
    gap: 1rem;
    min-height: 15rem;
    background-color: var(--theme-color-a);
  }
  #demo-tabs nav {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: .2rem;
    background-color: var(--theme-link-color);
    padding: 2rem;
  }
  #demo-tabs label {
    cursor: pointer;
    background-color: var(--theme-link-color);
    color: white;
    font-size: 1.2rem;
  }
  #demo-tabs input[type="radio"] {
    display: none; /* Hide the radio buttons */
  }
  #demo-tabs .tab-content {
    display: none; /* Hide all tab content by default */
  }
  #demo-tabs:has(input[value="home"]:checked) .tab-content#home {
    display: block; /* Show the selected tab content */
  }
  #demo-tabs:has(input[value="about"]:checked) .tab-content#about {
    display: block; /* Show the selected tab content */
  }
  #demo-tabs:has(input[value="more"]:checked) .tab-content#more {
    display: block; /* Show the selected tab content */
  }
</style>

Was it just as annoying as the first example? I hope so, but it's more likely you got it right the first time, as you're primed by the first demo. Still, the "..." is a small item to hit.

You should keep in mind that your users do not have this priming and they will probably keep clicking around. This is still not a good experience.

## What's the problem?

To put it simple: Reimplementing the browser's native elements or wrapping them to a point where the visual "button" is detatched from the actual button.

Let's say your code looks like this:

```html
<div class="button">
  <button>Click me</button>
</div>
```

Now you might add some CSS like this:

```css
.button {
  padding: 1rem 2rem;
  background-color: red;
  cursor: pointer;
}

.button button {
  background-color: transparent;
  border: none;
  color: white;
  appearance: none;
  -webkit-appearance: none;
}
```

This looks something like this:

<div class="button">
  <button onclick="alert('You clicked the button.')">Click me</button>
</div>
<style>
  .button {
    padding: 1rem 2rem;
    background-color: var(--theme-link-color);
    cursor: pointer;
    display: inline-block;
    border-radius: .5rem;
  }
  .button:hover {
    background-color: var(--theme-color-b);
  }
  .button button {
    font-size: 1.2rem;
    background-color: transparent;
    cursor: pointer;
    border: none;
    color: white;
    appearance: none;
    -webkit-appearance: none;
  }
</style>

But the problem is, that based on the layout, the items look like this:

<div class="button2">
  <button onclick="alert('You clicked the button.')">Click me</button>
</div>
<style>
  .button2 {
    padding: 1rem 2rem;
    outline: .2rem solid var(--theme-link-color);
    cursor: pointer;
    display: inline-block;
    border-radius: .5rem;
  }
  .button2 button {
    outline: .2rem solid var(--theme-link-color);
    font-size: 1.2rem;
    background-color: transparent;
    cursor: pointer;
    border: none;
    color: white;
    appearance: none;
    -webkit-appearance: none;
  }
</style>

...and only the button is interactive. and the outer div is not.

## Is it only buttons?

Obviously not. The same "problem" also applies to links and any other interactive element. Even worse when you're "faking" interactivity on a style level like adding `cursor: pointer` to the wrapper element (I intentionally did this above, but I've seen this many times in real production sites of major companies before).

## How to fix it?

<style>
  #demo-1 {
    cursor: pointer;
    background-color: var(--theme-link-color);
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: .5rem;
    font-size: 1.2rem;
  }
  #demo-1:hover {
    background-color: var(--theme-color-b);
  }
</style>
<button id="demo-1">Click me</button>
<script>
  document.getElementById("demo-1").addEventListener("click", function() {
    alert("You clicked the button!");
  });
</script>

Just use and style the element...

Your visual elements should somewhat match the actual DOM. From my experience you won't have any or little problems with this if you actually have a semantic DOM and your elements have semantic meaning without tons of wrapper elements. If you've gone the "React route" of tons of wrapper elements, you'll be fighting hard for this.

So the "fixed" code for the button above looks like this:

```html
<button>Click me</button>
```
```css
button {
  background-color: red;
  color: white;
  padding: 1rem 2rem;
  appearance: none;
  -webkit-appearance: none;
}
```

And with this "fix" applied every single tester was able to click the button on the first try. This is a huge difference and a much better experience for your users.
