---
title: Tabs vs. Spaces
abstract: |
  The  debate is strong and I have some opinions.
date: 2022-07-31
tags:
  - type:opinion
---

:::commentBlock
To make it clear before I start: My projects currently mainly use spaces. Nevertheless I will be advocating for using a combination of tabs and spaces in this post. I hope that tools like formatters will switch over to that documentation in the future.
:::

:::sidenote
Shoutout to @Surma for [tweeting about this](https://twitter.com/DasSurma/status/1553631634452348928). This was the trigger for me to write this blogpost.
:::

## The old song of "\t" vs " "

If you read this, you're most likely a developer yourself and you probably have at least some project which you have full control over yourself (be it as a lead in your company or a private project). Because it's the most common option, let's focus on private projects (although this does not mean that this doesn't apply for commercial ones!).

Let's start off with some examples.

Below are some examples of indentation and I encourage you to take a closer look at them:

```js
function main() {
 console.log({
  some: {
   object: "Hello World"
  }
 })
}
```

```js
function main() {
  console.log({
    some: {
      object: "Hello World"
    }
  })
}
```

```js
function main() {
    console.log({
        some: {
            object: "Hello World"
        }
    })
}
```

```js
function main() {
        console.log({
                some: {
                        object: "Hello World"
                }
        })
}
```

<div class="toggle-tab-size">

```js
function main() {
	console.log({
		some: {
			object: "Hello World"
		}
	})
}
```

<input type="range" min=1 max=16 step=1 class="tabSlider" value=4>
</div>

<style>
  .toggle-tab-size pre code {
    tab-size: var(--tab-spaces, 4);
  }
</style>

{% rollup "assets/js/blog/2022-07-31-tabs-vs-spaces/tabWithSwitcher.js" %}

The first four examples are indented with 1, 2, 4 and 8 spaces and I expect that 2 and 4 spaces are the most common indentation settings you've seen until now (at least that matches my experience). But not everyone is comfortable with that and some people prefer other settings. I will try to show this to you now and for this let's talk about a11y:

## Accessibility of tabs

I believe that a11y is important for all of us and not only when looking at finished products, but also when creating them. Especially when doing open source, why would you lock out contributers just because they don't have eyes as good as you do?

Let's imagine that you have fairly bad eyes (some of us don't even need to imagine). Let's say you have really bad eyes, to a level of using 500% zoom (on a desktop machine). Zoom this page and take a look at the examples above. As you can probably see, a lower number of spaces per tab is no sufficient to show you the indentation level and on higher indentation levels it overflows the line. This means that you can only have less context on the screen.

After the last example you can see a slider. The last example is written with tabs and the slider allows you to set the spaces per tab on the last example. Use it now to find a comfortable tab width. The slider doesn't show you a value on purpose, so you don't always go to the nice and round numbers you're used to.

Now let's go in the opposite direction: Let's say you have fairly okay eyes (or a really wide screen), but you have problems with shape recognition, so finding vertical lines for you is really hard. To simulate this, zoom out as far as you can and now play again with the slider and find a comfortable position. This will most likely by more spaces per tab than before.

## Code has to look consistent - or does it?

When I propose using tabs over spaces, I often get a response that code with tabs does not look consistent across devices. One example why this is not always wanted was shown above, but sometimes I get confronted with code like this:

<div class="toggle-tab-size">

```python
def some_fn(that, has, 
			some, parameters):
	x = 4
	y = 2
	z = divides(dividend=x,
				divisor=y)
	print(z)
```

<input type="range" min=1 max=16 step=1 class="tabSlider" value=4>
</div>

Everything is neatly aligned until you start using the slider, but for this I have a simple solution: Mixing

<div class="toggle-tab-size">

```python
def some_fn(that, has, 
            some, parameters):
	x = 4
	y = 2
	z = divides(dividend=x,
	            divisor=y)
	print(z)
```

<input type="range" min=1 max=16 step=1 class="tabSlider" value=4>
</div>

As you can see, everything is neatly aligned and supports customizing tab sizes, but how did I do this?
Let me explain:

<div class="toggle-tab-size">

```python
def some_fn(that, has, 
            some, parameters):
#^^^^^^^^^^^ these are all spaces
	x = 4
#^ this is a tab (\t)
	y = 2
	z = divides(dividend=x,
	            divisor=y)
#	^^^^^^^^^^^^ these are spaces
#^ This is a tab
	print(z)
```

<input type="range" min=1 max=16 step=1 class="tabSlider" value=4>
</div>

So to put it simple, you start a line with tabs to achieve the nesting level you need and inside of the "block nesting" you use spaces to neatly align stuff. That way you have character alignment where it is required and a11y tabs where it is not.

## Keeping everything in sync

I can't be bothered to keep spaces and tabs neatly organized and so can't you, but IMO this is not the task of the developer. We have tools for this, let your formatter handle this!

So let's build a better, more inclusive future together where everyone can participate and customize their code editing experience where we use tabs and spaces together.
