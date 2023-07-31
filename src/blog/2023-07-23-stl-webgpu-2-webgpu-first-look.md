---
title: First look at WebGPU
abstract: |
  In this entry to my new series about WebGPU and .STLs I'll take a first look at WebGPU.
  Join me on this completely new experience.
date: 2023-07-23
tags:
  - series:webgpu-stl
---

:::commentBlock
This post is part of [my series about WebGPU and .STLs](/blog/2023-07-23-stl-webgpu-0-announcement/).
In case you've missed it, I strongly recommend reading my [previous post about parsing STL files](/blog/2023-07-23-stl-webgpu-1-stl-files/) first, as this post will build on that.
:::

## GPUs are scary

Using GPUs efficiently is a fairly complex topic and I've strained away from it for a long time.
Since you can do a lot of awesome stuff with just HTML and CSS and even more nice things with JS and canvas elements, using GPUs yourself on a lower level never was interesting enough to me to be worth the hassle.
Especially looking at WegGL always seemed strange to me, since it's based on the old OpenGL standard and feels a lot like it's not made for the web. Also doing compute on the GPU is really hard with WebGL, since it's not really made for that.

This changes with WebGPU. It's a newer standard made for the web and because the web has to be cross platform and performant, just like with WASM we see WebGPU being used for native platforms as well. Here we can clearly see how development on the web improves the situation for everyone.

### Why do it anyways?

GPUs are fast. Crazy fast in fact. But they can only flex their muscles if you know how to use them and by that I mean, that you need to have a task that can be performed with the same instructions at once on many, many cores at once.
So in the end, if you know how to use a GPU, you can see massive performance improvements with the added bonus of consistency.

### How are GPUs different from CPUs?

This is a simplified description for the topic at hand.

Let's imagine the process of execution as taking an instruction and the data you want to use, executing it and returning the result.
Now let's split that process into one part that decides what gets executed (the **commander**) and one part that actually executes the command on data (the **executer**).

To make this more clear, I made the following demo. It renders this function:

```js
const getPixelColor = (x, y, demoSize) => {
  const middle = Math.floor(demoSize / 2);
  const distanceX = Math.abs(x - middle) / middle;
  const distanceY = Math.abs(y - middle) / middle;
  const diagonal = (x + y) / demoSize / 2;
  return {
    r: 1 - distanceX,
    g: 1 - distanceY,
    b: diagonal,
  };
};
```

This could be taken as a very, very simple "shader" and the result looks like this:

<style>
  .demo_canvas {
    aspect-ratio: 1/1;
    width: 100%;
    max-width: 30rem;
    margin: auto;
    image-rendering: pixelated;
    background: #000;
    image-rendering: crisp-edges;
  }

  .demo_wrapper {
    text-align: center;
  }

  .demo_wrapper button {
    padding: var(--s);
    margin-bottom: var(--m);
  }
</style>

{% rollup "assets/js/blog/2023-07-23-stl-webgpu-2-webgpu-first-look/main.js"%}

<p class="demo_wrapper">
  <canvas class="demo_canvas" id="demo_first"></canvas>
</p>

:::sidenote
I can't stress enough how much I'm simplifying here!
This is not how a CPU actually work as it would be broken down into actual CPU instructions.
Also the JS interpreter and/or JIT would make opimizations on this. Just is just meant to show how CPUs and GPUs step through your procedure in general.
:::

A CPU would step through it like this:

<div id="demo_cpu">

```js
const getPixelColor = (x, y, demoSize) => {
  const middle = Math.floor(demoSize / 2);
  const distanceX = Math.abs(x - middle) / middle;
  const distanceY = Math.abs(y - middle) / middle;
  const diagonal = (x + y) / demoSize / 2;
  return {
    r: 1 - distanceX,
    g: 1 - distanceY,
    b: diagonal,
  };
};
```

<p class="demo_wrapper">
  <button id="start_cpu_render">Start Render</button><br>
  <canvas class="demo_canvas" id="demo_cpu_canvas"></canvas>
</p>
</div>

The yellow marker signals the current position of the **commander** and the white square the position of the **executer**.
As you can see, the CPU renders each pixel one by one (In reality this can be improved by using multiple cores and SIMD, but let's keep it simple instead). Next we see how a GPU would do this:

<div id="demo_gpu">

```js
const getPixelColor = (x, y, demoSize) => {
  const middle = Math.floor(demoSize / 2);
  const distanceX = Math.abs(x - middle) / middle;
  const distanceY = Math.abs(y - middle) / middle;
  const diagonal = (x + y) / demoSize / 2;
  return {
    r: 1 - distanceX,
    g: 1 - distanceY,
    b: diagonal,
  };
};
```

<p class="demo_wrapper">
<button id="start_gpu_render">Start Render</button><br>
  <canvas class="demo_canvas" id="demo_gpu_canvas"></canvas>
</p>
</div>
