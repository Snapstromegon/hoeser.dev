---
title: AI is not always the answer
abstract: |
  AI for security or breaking security? Sometimes a simple script is better.
date: 2026-07-16
tags:
  - type:opinion
---

:::commentBlock
Before you label me as an "AI-hater", read this post completely.
AI is a tool, but like every tool you should be aware when it is the right tool and when it's not.
:::

## Context for this post

A couple days back there was a post on reddit about [a captcha that takes fable5 10 minutes to solve](https://www.reddit.com/r/webdev/comments/1uxfzav/made_a_captcha_that_takes_fable_5_10_minutes_to).

The trick of this captcha is the same as with [Ghost Font](https://www.mixfont.com/ghost-font). Making movement an essential detail so screenshots can't be used to show the content.

Here is an example of what a screenshot of such a captcha looks like:

![Random cloud of colorful pixels](/assets/img/blog/2026-07-16-ai-is-not-always-a-good-solution/captcha.png)

One of the core arguments of the author was that this captcha is so good, that even the most modern AI models struggle with this and that it would neither be realistic nor cost efficient to break this captcha.

## But there's a problem

As someone that uses AI as a tool and not a wonderful magic box for everything, it was very obvious to me that LLM and GPT models are not the right tool for the job to build a captcha-cracker.

Especially not for this type of captcha.

Instead we can take a look back at 80s. No, really. To be more precise 1987. That's when the first optical mouse came out and they do exactly what's needed here to solve this "new" type of captcha. Find regions of pixels that move across the screen.

## It gets worse

Because the captcha consists of a linearly scrolling background and moving characters across it, we only need to find what didn't move like the background and push the result into an OCR engine like [tesseract](https://tesseract.projectnaptha.com/).

## How to attack this

If what I described above is not already enough to get where I'm going, here a pretty simple description of what I did to break this captcha:

1. Take two screenshots of two consecutive frames of the captcha (doesn't really have to be consecutive, but the closer, the easier the computation is)
1. For every pixel find a pixel below it (increase y-coordinate) that has the same color (if it exists)
1. Calculate the average of this "shift" as an integer
1. Mark all pixels that don't match this pattern

The result looks something like this, which can easily be fed into any OCR engine:

![Captcha Input and clearly readable Captcha result](/assets/img/blog/2026-07-16-ai-is-not-always-a-good-solution/analysis.png)

The code for this "filter" step looks something like this:

```js
let totalShifts = 0;
let totalPixels = 0;
for (let col = 0; col < captcha.width; col++) {
  for (let row = 0; row < captcha.height; row++) {
    for (
      let cmpRow = row;
      cmpRow < Math.max(captcha.height, row + 10);
      cmpRow++
    ) {
      const index = (row * captcha.width + col) * 4;
      const cmpIndex = (cmpRow * captcha.width + col) * 4;
      if (pixelIdentical(lastImageData[index], imageData[cmpIndex])) {
        // [sh! ~~:4]
        totalShifts += cmpRow - row;
        totalPixels++;
        break;
      }
    }
  }
}
const averageShift = Math.round(totalShifts / totalPixels); // [sh! ~~]
```

And then the marking:

```js
for (let col = 0; col < captcha.width; col++) {
  for (let row = averageShift; row < captcha.height; row++) {
    const index = (row * captcha.width + col) * 4;
    const shiftedRow = row - averageShift;
    const shiftedIndex = (shiftedRow * captcha.width + col) * 4;
    if (!pixelIdentical(imageData[index], lastImageData[shiftedIndex])) {
      // [sh! ~~:2]
      fillPixelBlack(outputData, index);
    }
  }
}
```

:::sidenote
By the way, I'm not really simplifying here and the blocks of the OCR already contain the character positions for automating the clicks.
:::

And finally you just do the OCR:

```js
const res = await tesseractWorker.recognize(outputCanvas, "eng", "blocks");
if (
  res.data.symbols.length == 2 &&
  Math.min(...res.data.symbols.map((s) => s.confidence)) > 80
) {
  const detectedSymbols = res.data.symbols.map((symbol) => symbol.text);
  detectedSymbols.sort();
  const detectedText = detectedSymbols.join("");
  alert(detectedText);
}
```

:::commentBlock
If you want to see the whole thing, the code is available [as a GitHub repo](https://github.com/Snapstromegon/vibe-captcha).
:::

## Is it fast enough?

You tell me. On my machine the whole pipeline runs in &lt;10ms. I think that's plenty fast.

## But what if...

There were a bunch of speculations of what might make this easy script impossible and I want to discuss them here.

### I already block browser automations in the captcha

Keep in mind that the captcha is running in an untrusted environment and these automation detections work by finding some magic environment behavior (most often global variables).
As the scripter you can easily work around this (often by just importing a npm package) and worst case building a chromium version that doesn't inject special things in the automation environment is totally possible.

### I can magically detect all automated browsers

Okay, then we'll just do a screen capture - worst case with a webcam to the screen.

### Let's change the movement of the background / let's rotate it / jump

All of these are interesting ideas, sadly computers are way better at detecting moving pixel blobs than humans, so you make it so difficult that no computer can solve it, but at the same time you'll also lock out all humans.

### Randomize the letter movement

This makes no difference at all. My solution doesn't even care about the letters as it looks for the stuff that's not moving like the background.

### Make each column in the background move at different speeds

Good idea, but the algorithm works (with slight changes) also on a column by column basis. Basically every mathematical function could be broken that way.

### Let the letters change/jump every X seconds

Congrats, you're making the problem harder for humans, but not the bot.

### And more ideas

All of the ideas in the sub in the end made it harder for humans or made no difference at all.

## So this was also about AI

For some weird reason many users in the sub took "is a LLM/GPT model able to solve this directly" as any kind of valid metric and disregarded normal scripting solutions completely. Even the test prompts were mostly about "solve this captcha" and not "generate me a tool that can solve this captcha".

Like mentioned in the beginning, it's important to understand what these models are good at. Using them to generate tools can be quite nice. Getting hints at what e.g. established algorithms are or how to integrate OCR is quite a good question for these models, but they are pretty slow, so fast interactions in a browser is inherently not their strength (not speaking of the cost impacts).

I honestly don't get how your first thought when asked to crack this captcha with a ML based system would be to ask it to do it live instead of generating you a tool to do it. Are we loosing some skills as the development community in general? Did we somehow run into the believe system that if modern model can't do something easily, it must be hard problem?

I refuse that this is the future we should be striving for. This is for me one of the reasons these models are still more like a junior that actually need a lot of guidance and are better treated like a better autocomplete and not like a standalone developer that's taking my job. BUT keep in mind that every junior will become an average or even great developer at some point while the models are hitting their ceiling sometimes faster than you think.

> A jack of all trades is a master of none, but oftentimes better than a master of one.

The thing is: As software developers we're not striving to be masters of one. Our jobs are inherently so multifaceted, that we are experts in fields which themselves often span whole regions.

IMO right now models are very good at T-shaped knowledge, just without the stem.
