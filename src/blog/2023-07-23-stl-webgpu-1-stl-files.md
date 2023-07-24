---
title: Parsing STL files
abstract: |
  In this entry to my new series about WebGPU ant .STLs I'll take a look at how STL files work.
date: 2023-07-23
tags:
  - series:webgpu-stl
---

:::commentBlock
This post is part of [my series about WebPGU and .STLs](/blog/2023-07-23-stl-webgpu-0-announcement/).
:::

:::commentBlock
The content of this post on STL files is based on the [corresponding Wikipedia article](<https://en.wikipedia.org/wiki/STL_(file_format)>).
:::

## Basic Structure

A STL file is at its core just a collection of triangles.

### ASCII

STL files can have two representations. One is based on ASCII and you know it's ASCII, because it starts with the string "solid". For now we'll completely ignore the ASCII representation, because the binary one is way more common.

### Binary

If a STL file does not start with the string "solid", it's in binary format.

#### General notes

STL binary files are an utterly broken format. Among other things I think this because:

- they have an 80 byte header with undefined usage
- they contain a normal vector that is redundant information and could save ~25% of file size
- they contain an attribute byte count value, but no definition on how to use attributes
- many software solutions misuse the normal and or attribute values
- some software leaves the normal vector as 0 - always
- they don't include information about the unit and the only hack around this contains a string anywhere in the header

Basically you can't rely on anything aside from the placement of the vertex corner bytes for which you often have to guess the unit.

At least no one tempers with the fact that STL files are written in little-endian byte order.

#### Structure

##### Header

The file has a header of 80 bytes containing anything (most often the name of the program that created the file and maybe some metadata), followed by a u32 telling you the total number of triangles. THis is IMO the best part of the format, because instead of things like ZIP files, you actually know how many entries you expect before having the whole file.

##### Triangles

Each triangle entry is fifty bytes long. It's order is:

1. **Bytes 01-12:** Normal vector
2. **Bytes 13-24:** Corner 1
3. **Bytes 25-36:** Corner 2
4. **Bytes 37-48:** Corner 3
5. **Bytes 49-50:** Attribute byte count

We need to ignore 1. and 5. because some 3d software stores other information in these bytes and sometimes even doesn't set things like the normal vector at all. In reality you'd probably want to check the normal, but we'll ignore it here.

We don't need the normal, because the corners are ordered counter clockwise. That way we know which way is out and calculate it ourselves.

## Parsing an STL file

As an example we'll use the famous [Utah teapot](https://en.wikipedia.org/wiki/Utah_teapot). You can get the STL file I'm using from there.

### The Header

:::writer-thought
So what did we learn about headers right before this?
:::

:::reader-thought
The first 80 bytes shouldn't start with "solid".
:::

So let's write a small piece of JS, that fetches the file and checks wether the file starts with the string "solid".

```js
const request = await fetch("teapot.stl");
const stl = await request.arrayBuffer();
const magicChunk = stl.slice(0, 5);
const textEncoder = new TextEncoder("ascii");

const isBinarySTL = textEncoder.decode(magicChunk) == "solid";
```

If we take a look at the header of the STL file we can see that it contains the string "Exported from Blender-2.74 (sub 5)". So the first 5 byte are "Expor" which definitely isn't "solid". Great, just as planned, this is indeed a binary STL.

### The number of triangles

Let's do the same with the number of triangles:

```js
// code from before
// [sh! focus:start]
const dv = new DataView(data.slice(80));
const triangleCount = dv.getUint32(0, true);
```

This tells us that the teapot is made out of 9438 triangles.

To explain in a little more details what is happening here:

First a `DataView` is created for the stl array buffer. This allows us reading and writing multi-byte data to the array buffer directly. This is also what we use in the next line to read a u32 - a 4 byte unsigned integer. The call means that we want to read a 4 byte value starting at offset 0 in the `DataView` and the value is "little-endian" (that's what the true means).

### Loading the triangles

#### Loading a triangle

To parse a triangle we use the `DataView` to read the three corners:

```js
const triangleOffset = 0; // Will be defined next
const triangle = [
  {
    x: dv.getFloat32(triangleOffset + 4 * 4, true),
    y: dv.getFloat32(triangleOffset + 5 * 4, true),
    z: dv.getFloat32(triangleOffset + 6 * 4, true),
  },
  {
    x: dv.getFloat32(triangleOffset + 7 * 4, true),
    z: dv.getFloat32(triangleOffset + 8 * 4, true),
    y: dv.getFloat32(triangleOffset + 9 * 4, true),
  },
  {
    x: dv.getFloat32(triangleOffset + 10 * 4, true),
    z: dv.getFloat32(triangleOffset + 11 * 4, true),
    y: dv.getFloat32(triangleOffset + 12 * 4, true),
  },
];
```

#### Loading all triangles

Now let's do it for all of those 3-pointed heros.

```js
const triangles = [];
for (let i = 0; i < triangleCount; i++) {
  // 2 bytes triangle count + 50 bytes per triangle
  const triangleOffset = 4 + 50 * i; // [sh! focus:end]
  const triangle = [
    {
      x: dv.getFloat32(triangleOffset + 4 * 4, true),
      y: dv.getFloat32(triangleOffset + 5 * 4, true),
      z: dv.getFloat32(triangleOffset + 6 * 4, true),
    },
    {
      x: dv.getFloat32(triangleOffset + 7 * 4, true),
      z: dv.getFloat32(triangleOffset + 8 * 4, true),
      y: dv.getFloat32(triangleOffset + 9 * 4, true),
    },
    {
      x: dv.getFloat32(triangleOffset + 10 * 4, true),
      z: dv.getFloat32(triangleOffset + 11 * 4, true),
      y: dv.getFloat32(triangleOffset + 12 * 4, true),
    },
  ];
  triangles.push(triangle); // [sh! focus:start]
}
```

<details>
<summary>
If you're coding along, I have the first three triangles here, so you can verify your data.
</summary>

```json
[
  [
    {
      "x": 0.4866879880428314,
      "y": 0.03043295256793499,
      "z": 8.555168151855469
    },
    {
      "x": 0.49079200625419617,
      "z": 0.09375695139169693,
      "y": 8.555167198181152
    },
    {
      "x": 0.03138900175690651,
      "z": 0.09375695139169693,
      "y": 8.571527481079102
    }
  ],
  [
    {
      "x": 0.4747079908847809,
      "y": -0.030000047758221626,
      "z": 8.555167198181152
    },
    {
      "x": 0.4866879880428314,
      "z": 0.03043295256793499,
      "y": 8.555168151855469
    },
    {
      "x": 0.03138900175690651,
      "z": 0.09375695139169693,
      "y": 8.571527481079102
    }
  ],
  [
    {
      "x": 0.49079200625419617,
      "y": 0.09375695139169693,
      "z": 8.555167198181152
    },
    {
      "x": 0.4866879880428314,
      "z": 0.03043295256793499,
      "y": 8.555168151855469
    },
    {
      "x": 0.7859389781951904,
      "z": -0.011186037212610245,
      "y": 8.508925437927246
    }
  ]
]
```

</details>

### And now?

:::reader-thought
Great, now I have a bunch of numbers in some arrays. What can I do with them?
:::

:::writer-thought
Not much, but we'll get there.

Let's write a small JS renderer first.
:::

## Render the STL to verify

Since a bunch of numbers don't tell a lot, let's create a minimal renderer for STLs.

For this we need a 2D context for a properly sized canvas element:

```js
const canvas = document.querySelector("#js-stl-render-output");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");
```

After this we need to know how big the model has to be scaled:

```js
const flattenedTriangles = triangles.flat();
const minX = Math.min(...flattenedTriangles.map((p) => p.x));
const maxX = Math.max(...flattenedTriangles.map((p) => p.x));
const minY = Math.min(...flattenedTriangles.map((p) => p.y));
const maxY = Math.max(...flattenedTriangles.map((p) => p.y));

// make the model perfectly fill the canvas
const maxScaleX = canvas.width / (maxX - minX);
const maxScaleY = canvas.height / (maxY - minY);
const scale = Math.min(maxScaleX, maxScaleY);

// shift the model to be perfectly centered
const center = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};
const shift = {
  x: center.x - ((maxX + minX) / 2) * scale,
  y: center.y - ((maxY + minY) / 2) * scale,
};
```

:::commentBlock
And now a small trick:

To avoid some problems with the order of triangles (like a triangle from the background being drawn over one in the front), we just sort all triangles by their z order. This is an easy solution that is not very robust, but it will be enough for now.

```js
triangles.sort(
  (a, b) => Math.min(...b.map((p) => p.z)) - Math.min(...a.map((p) => p.z))
);
```
:::

And finally render all triangles:

```js
ctx.strokeStyle = "#fff";
ctx.fillStyle = "#aaa";
for (const triangle of triangles) {
  ctx.beginPath();
  ctx.moveTo(shift.x + triangle[0].x * scale, shift.y + triangle[0].y * scale);
  ctx.lineTo(shift.x + triangle[1].x * scale, shift.y + triangle[1].y * scale);
  ctx.lineTo(shift.x + triangle[2].x * scale, shift.y + triangle[2].y * scale);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}
```

## Demo Time

<style>
#js-stl-render-output{
  width: 100%;
  aspect-ratio: 1/1;
  background: #000;
}
  </style>

<canvas id="js-stl-render-output"></canvas>

## Until next time

Now that we have a working render and know how to parse STL files, we can close this first entry in my new series.
Next time we'll have a first look at WebGPU and maybe even get something on the screen.

{%rollup "assets/js/blog/2023-07-23-stl-webgpu-1-stl-files/main.js" %}
