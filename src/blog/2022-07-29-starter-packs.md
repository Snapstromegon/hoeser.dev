---
title: Stop using starter packs
abstract: |
  Starter packs / starter projects / project templates or however you want to call them, I don't like them and you can read here why.
date: 2022-07-29
tags:
  - type:opinion
---

:::commentBlock
I know that the topic of project templates is very close to being a religious discussion, but sometimes I just like to live dangerously.

Your starter project may be great, but I think it's unlikely.
:::

Especially in the web dev world the concept of starter projects is really common and you probably find no bigger project/library/framework that doesn't offer one and on the surface, they look great. Sadly if you dig deeper, they start to show their darker side, so buckle up and follow me for a bumpy ride.

## What are project templates?

One of the most common examples is [create-react-app](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) which is also an example of why I don't like them (more on that later).
A starter project allows you to use a single command (e.g. `npm init <template> <project>`) to prepare a whole project, so you start with all required tools already installed and not a blank slate.

## Why would you use a project template?

There are many reasons why one would use a starter project. I will discuss the major ones I see and why I think there are better options out there and which I'd choose instead.

### The Newbie

This is not to downplay the skill of people using starters. Everyone has to start somewhere.

If you don't yet know e.g. React (I will use it as an example here, but this applies just as well to others) and you want to learn it, a starter project will get you up and running in just a couple of minutes. You don't even need to make many decisions on how to build your stack, the starter authors make them for you.

And this is also my pain point!

**If you don't create your project yourself, you often don't know how it works.** If you are the "Newbie", I guess that you want to learn something, and at least I want to know why something is this way before I just take it as a given. So e.g. if I create a new react app I want to know why I choose jest over other options, what bundler I use and how I could swap them and I want to understand what dependencies I take on.

I love to always start with an empty folder and then follow a guide on how to fill it. It's okay if that guide then only follows one route and scratches alternatives only on the surface like "We now use esbuild to create a bundle. You could use rollup or webpack instead, but for simplicity's sake we focus on esbuild here". This tells the new dev, that esbuild is often the preferred option by the authors, that there are other options and I know directly where to look when I want to swap them. `create-react-app` on the other hand abstracts this away into a build command `react-scripts build` which leaves little room to play.

"**But I just want to get something running**" - is something I hear often in response and I understand that, but I believe that this just creates more issues down the line. Of course, you get a hello world going in minutes, but once you get to a point where you have any deeper issue, you're already deeply invested in the stack the starter chose even though it might've been obvious at the start that your usecase would benefit from slight deviations. This also falls into my line of learning tools/frameworks and not fundamentals. If you learn a tool like a hammer every skrew will look to you like a nail and if it doesn't work at first, you might start to just hammer harder instead of reevaluating your approach.

### The Expert

This is the opposite of the "Newbie". If you are the "Expert", you know your tool/framework in and out and you can explain every quirk. At this point, you probably can easily set up the project yourself and instantly know which up and downs you can expect from choosing something in your stack. Using a starter normally is just a time saver for you.

#### Long Term Projects

As the Expert, you probably need to maintain one of two types of projects. The first one is the long-term project. This is something like Twitter, Facebook, or any other indefinitely running project. These are often slow-moving projects which can't just jump frameworks and tools all around and need very deliberate choices. Also, their runtime is often longer than that of a starter project, so if e.g. react abandoned react-scripts with the next version (which it will not), you will probably still be using it for some time. In this case, I think the small time you have to invest to manually set up the project is well invested as it also leads to you making more deliberate choices about what you include or exclude.

#### Short Term Projects

This is more like the quick event page which stays relevant for a couple of weeks or months and then will be just deleted and forgotten. In this case, you don't have to fear picking a "bad" tool, as it doesn't hurt you long-term if you just play around with some quirks. Here project templates are especially common because they make the project setup less time-consuming. Still, I believe that you shouldn't be using default templates!

**And now the shocker:** Build your own template. I know that I've spent way too many words until now telling you not to use templates, but now I tell you to use them. The thing is, that you shouldn't be using some generic template, but it's totally fine to use highly specific templates for you and your organization. This template can be custom built for you and can already include many of the things normal templates don't / can't include like a basic CI setup (do you use Jenkins, GitHub Actions, GitLab CI, CircleCI, ...), how you deploy and what your standard environment looks like. This makes deployment even faster and allows you to keep control over your stack.

### The "In-Between"

You are neither a newbie nor an expert? You can probably benefit from both approaches! You can learn something new when doing a fresh setup and you probably have some opinions already.
E.g. why would you jump from webpack to rollup to esbuild, when you were happy with rollup all along and you have some plugins built for it? Keep it. As long as it's maintained, you're probably not worse off than switching around. Quite the opposite, you most likely will benefit from the knowledge you already have from past projects or time.

## So what should you do?

I would do the following: Start from a simple empty folder and use guides to build your projects. Try to understand at least most of the steps along the way, so that if you e.g. find an issue in your build step, you can fix them yourself.

This will lead to you learning more about how the ecosystem works and also gives you more options to customize the whole project for your use case.
