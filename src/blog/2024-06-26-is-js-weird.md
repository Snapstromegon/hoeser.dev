---
title: Is JS weird?
abstract: |
  It's kind of a meme that JS is "weird". In this post I want to take a closer look at that.
date: 2024-06-26
tags:
  - lang:js
---

I can't count how often I run across a blogpost, meme or "quiz" that wants to tell you that JS is weird and you should swap it for a different language if you can.
WebAssembly even put this to a new hype, where some individuals even want to put other scripting languages in the browser even if it means that you'd be downloading about 40MB to get a basic runtime going just to avoid working with JS.
In this blogpost I want to take a couple if common examples for the weirdness of JS, explain them and take a closer look at if it is actually JS being weird, or if the same behavior is true for other languages / there's a reason unrelated to JS.

## Standards, those damn standards

### Fun with floats

```js
0.1 + 0.2 == 0.3; // false
Object.is(0 * -1, 0); // false
typeof NaN; // Number
NaN === NaN; // false
9007199254740992 == 9007199254740993 // true
```

JS uses IEEE754 floating point numbers for nearly everything. This means that you have to work with 32 bit precision on everything and it adheres to all the standardized stuff around floats.

So let me explain what's happening above:

```js
0.1 + 0.2 = 0.30000000000000004
```

0.1 and 0.2 are irrational numbers in the binary system (like 1/3 in the decimal system). Because of this you run into a rounding error, which means that it's close, but not quite 0.3. Because of this you can always write float equality comparisons like this to be save:

```js
const delta = 1E-10;
if((0.1+0.2) - 0.3 < delta) { /*...*/ }
```

This way you avoid the rounding issues.

Next one is +0 and -0. These also come from how floats work. In floats the first bit (MSB) is always the sign (0 for +, 1 for -), so there are actually two 0 values. Per the standard they are equal on a value level (that's why `0 === -0`), but on a bit level they differ. In JS it's not that useful, but in general you can use that value to not loose info. E.g. if you calculate `x/Infinity` it will result in `-0` and therefore you know that `x` was negative.

On a related note: Why is the type of "Not a Number" (NaN) "Number"? Again, floats. The standard defines the name, value and behavior of NaN and so first of all it is a Number.

Next, why is `NaN != NaN`? And, say it with me, floats. This might seem counterintuitive at first, but hear me out. Is the number "peter" the same is the number `1/0`? There is no correct answer for this, as both questions result in `NaN`. Because of this the standard defines that any equality check with `NaN` always returns `false`.

```js
9007199254740993; // 9007199254740992
```

Finally counting is hard. Why is `x + 1 === x`? Again, because floating point precision. `9007199254740993` is just not representable as a 32 bit float. It's a little like I'd ask you to calculate `5 + 0.1` using only whole numbers. But there's help. You can use BigInts and you can check if your value is bigger than `Number.MAX_SAVE_INTEGER` (which is the last integer value you can safely add 1 to).

## Runtime vs. language

- document.all
- why does browser X to Y?

## Other languages have problems too

- C: array[2] == 2[array]

## Do you really do this?

## Where JS is actually weird