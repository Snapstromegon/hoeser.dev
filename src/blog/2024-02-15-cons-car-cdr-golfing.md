---
title: Cons, Car, Cdr and a little golfing
abstract: |
  The native Web GmbH is publishing little coding challenges and I like to do code-golf with them.
  This is my solution to their challenge from november 2023.
date: 2024-02-15
tags:
  - lang:JS
  - Code Golfing
---

:::commentBlock
In case you don't know about [Code Golfing](https://en.wikipedia.org/wiki/Code_golf), it's trying to write the shortest version of a program. The resulting code is nearly always unreadable, unmaintainable and should never be used in production, but it's often a nice challenge to use stuff you normally wouldn't use and to deepen your knowledge in a language.
:::

## Context

The german [the native web.](https://thenativeweb.io/) [YouTube Channel](https://www.youtube.com/@thenativeweb) hosts a weekly coding challenge for their "Coding Circle" members. It's usually some short task that you can solve in 10-15min and the real value is in the solution videos, which explain the core concepts in depth and often teach you some basics in computer science. Especially if you don't have a "traditional" CS background, stuff like this can be very valuable and the way Golo explains, is IMO really great. If you understand german, it's definitely worth taking a look at the channel and maybe even checking out [my live stream with them](https://youtu.be/SsdC4acgzXg) (also in german).

## The Challenge

The challenge is based on the [lisp cons concept](https://en.wikipedia.org/wiki/Cons), which is a function, that holds a pair of data provided as parameters.

A JS implementation of `cons` could look like this:

```js
const cons = (a, b) => (f) => f(a,b);
```

<details>
<summary>
If the above is not completely clear to you, I have a more detailed explanation here.
</summary>

### Step by Step explanation

#### Rewrite more readable

Let's unwrap this first and for this I'll rewrite it more readable:

```js
const cons = (a, b) => {
  return (f) => {
    return f(a, b);
  };
};
```

Now let's got through it step by step.

#### Define a function

First we have a function which takes two parameters `a` and `b`.

```js
const cons = (a, b) => { // [sh! ** ~~]
  return (f) => {
    return f(a, b);
  };
}; // [sh! ** ~~]
```

#### Return a function

This function returns a function itself, which takes one parameter `f`.

```js
const cons = (a, b) => { // [sh! **]
  return (f) => { // [sh! ** ~~]
    return f(a, b);
  }; // [sh! ** ~~]
}; // [sh! **]
```

#### Call the parameter

This parameter `f` is itself a function, which get's called with `a` and `b`.

```js
const cons = (a, b) => {
  return (f) => {
    return f(a, b); // [sh! ~~]
  };
};
```

### Example usage

This is how you could use example:

```js
const pair = cons(3, 4);
// pair is now a function returned by cons

// let's create a function, which adds two parameters
const add = (a, b) => a + b;

// call pair with add as a parameter
const result = pair(add); // we don't call add, but pass it along

console.log(result); // Prints 7 (3+4)
```

Now back to the challenge.
</details>

### Car and Cdr

`car` and `cdr` are two functions closely related to `cons`, as they are meant to access the first (`car`) and second (`cdr`) element of a cons pair. The task is to implement these functions.

## The clean solution

I'll just dump the more or less clean solution here, since I don't think they are that interesting and very self explanatory.

### Car

```js
const car = (a, _) => a;
```

### Cdr

```js
const cdr = (_, b) => b;
```

## Let's get golfing...

### Cdr

I'll start with `cdr`, since there's less to do.

```js
const cdr = (_, b) => b; // 24 chars
```

Remove whitespace:

```js
const cdr=(_,b)=>b; // 19 chars
```

Use shorter variable declaration:

```js
let cdr=(_,b)=>b; // 17 chars
```

Trust [ASI](https://en.wikibooks.org/wiki/JavaScript/Automatic_semicolon_insertion):

```js
let cdr=(_,b)=>b // 16 chars
```

Turn to the dark side, by not declaring your vars:

:::sidenote
We need the semicolon on one side, since ASI might be problematic.
:::

```js
cdr=(_,b)=>b; // 13 chars
```

But this is a version that will not run in strict contexts like modules, so we'll keep the 16 char version.

### Car

```js
const car = (a, _) => a;
```

Apply all the above from `cdr`:

```js
let car=(a,_)=>a // 16 chars
```

Remove unused parameters:

```js
let car=(a)=>a // 14 chars
```

And also the parentheses:

```js
let car=a=>a // 12 chars
```

The dark side would even go further down

```js
car=a=>a; // 9 chars
```

### Combining both

We can do even more when doing both by using `,` declarations:

```js
const car = (a, _) => a;
const cdr = (_, b) => b;
```

Short versions:

```js
let car=a=>a
let cdr=(_,b)=>b
```

Use `,`:

```js
let car=a=>a,cdr=(_,b)=>b // 25 chars
```

And turn it dark:

```js
car=a=>a;cdr=(_,b)=>b; // 22 chars
```

So in the end the solution for both is shorter than each was on their own in the "clean" version.
By the way, this is the type of thing a minifier would do to your code, to safe bandwidth to your clients.

If you find an even shorter solution, make sure to ping me somewhere and let me know. I love these kind of things.
