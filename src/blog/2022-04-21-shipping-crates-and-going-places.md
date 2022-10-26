---
title: Shipping crates and going places
abstract: |
  I published my first crate on crates.io which can be used for working with location data (parsing, serializing, resolving).
  This Post is about what I've learned during that process and how it feels to author a package with no real external input.
date: 2022-02-28
tags:
  - type:package
  - tool:cargo
  - lang:Rust
---

:::commentBlock
Like I said in the abstract, this is the first crate that I published to crates, so please don't be too harsh.

But I want to learn, so if you have some input, feel free to contact me or even create PRs or issues in the repo.
:::

I love Rust - there, I said it!

I do think that Rust is an awesome language and never before has a language felt so right doing it. Of course, it's not perfect. A type system where I could do something like this:

```rust
/// A numeric type which only takes the values 0 to 9 and match statements also only match on that.
type limited_number = 0..9;
```

... and getting type-checking from that would be awesome.

But overall I love the strict compiler and successful test runs, the embedded tests, and clean module approaches. I even like that it's fairly explicit about anything you do. This can be annoying, if you have to tell rustc for the 10th time in a row that you want your u8 as a usize or that you need your u32 to be a usize instead, but this also makes sure that I understand what's going on.

It's not like I don't have an understanding of low-level programming, I did write an OS for an 8-bit ATmega644 in university, created and contributed to some private ESP8266 / ESP32 projects, and have written C++ in the automotive sector, but every time I stumble upon some weird error or lint in Rust, I always tend to learn something new.

# So I did a thing...

It all started, when I began to port my Tankerkönig Prometheus exporter ([Link to Dockerhub](https://hub.docker.com/repository/docker/snapstromegon/tankerkoenig-prometheus), [Link to GitHub](https://github.com/Snapstromegon/tankerkoenig-prometheus)) (which is currently implemented in NodeJS) to Rust.

There wasn't an easy-to-use location service on crates.io and also no easy way to access the Open Street Maps [Nominatim API](https://nominatim.openstreetmap.org/). So at first, I implemented it just inside of the project, but that began to grow and grow. So at some point (around the 500 line mark), I decided that this might be a good time to try something new. This was mainly because the execution of tests wasn't as easy in the binary crate as in a lib one.

# Let's start a new Crate

## The first problem of Computer Science...

... is naming things. Good for me that I'm not creative, so I called it after what I wanted to do.
My Prometheus exporter uses the feature to **re**solve **coord**inates, so the name became **recoord**.

## Next Rust version

During my first steps with my new lib, [Rust 1.60.0](https://blog.rust-lang.org/2022/04/07/Rust-1.60.0.html) got released with nice new features like the new feature syntax. So I immediately jumped on that and took advantage of it (it's really nice, even though the feature testing tools still don't completely understand it).

## Setting targets

I wanted my lib to be able to handle a lot of stuff around coordinates, but also to be slim to use, extensible, and not get in the way of the user. For this reason, I decided that there should be just one base type, which is just a Coordinate for latitude and longitude, but that one only offers fundamental features and is meant more like the common base for all extensions and resolvers.

It also offers the option to try all available extensions to parse a string so you can just dump any string into the lib and it will do its best to resolve it to a location.

## So what can recoord do?

Recoord offers the following features for working with strings:

| Format  | Example               | Feature Flag   | From String | To String |
| :------ | :-------------------- | :------------- | :---------: | :-------: |
| dd      | 12.345,-3.45          | format_dd      |     ✔️      |    ✔️     |
| dms     | 50°10'20"N 10°25'30"E | format_dms     |     ✔️      |    ✔️     |
| GeoHash | ezs42                 | format_geohash |     ✔️      |    ✔️     |

Additionally, recoord can use the following resolvers to create a coordinate from a string with the help of external services:

| Resolver | Service                                                            | Feature Flag |
| :------- | :----------------------------------------------------------------- | :----------: |
| OSM      | [Open Street Maps Nominatim](https://nominatim.openstreetmap.org/) | resolve_osm  |

:::sidenote
Feel free to use recoord in your project, it's published under the permissive MIT license.
:::

### Example

```rust
let location_a = "12.345,-3.45";
let coordinate_a: recoord::Coordinate = location_a.parse();

let location_b = "Kölner Dom";
let coordinate_b = recoord::resolvers::nominatim::resolve_sync(location_b);
```

# Still open topics

The Resolver API is not yet stabilized. Sadly Rust doesn't (yet) allow to create async trait functions natively. Once that's resolved, I'll probably implement a resolver trait to make it easier to extend the lib.
Also, the extension of the Coordinate formats should be easier in the future, but I guess that's why the lib is only in version 0.x.y at the moment.

Another topic is WASM/WASI support.
At the moment it's not easily possible to make network requests in a standardized way from inside wasm/wasi modules and tokio (or any other async runtime) is also not supported. My target would be for the lib to be runnable from inside a wasm module, so it can easily be executed as a serverless function with a minimal footprint.

# What I learned from this adventure

## Strictness is good

While I do like Rust, most of my time I'm working in JS/TS and Python professionally. Those languages are highly flexible and are fairly lenient on what you can do.
Compared to that Rust is a polar opposite and I like that. C++ is also fairly strict, but with two different distinctions in my experience:

1. In C++ getting the compiler happy doesn't mean your output is happy
2. In C++ if the compiler isn't happy, hope for the best, error messages are not always helpful

I had it multiple times during the creation of recoord, that I restructured/refactored my code all over the place and thanks to the strict compiler it was always a "get the compiler happy and everything will work again" experience. This also led to a change in my behavior. While doing a refactor in many other languages for me means sitting down for a couple of hours, thinking about how to do it, planning the change, executing the change, fixing all obvious errors, and testing that nothing broke and no place was forgotten, in Rust you can't just miss a new enum variant in a match statement.

I am aware that Rust is not the only language that has this feature, but the combination of this, the borrow checker, and the performance is just so nice for me.

I even went so far as to make the compiler even more strict:

```rust
#![forbid(unsafe_code)]
#![deny(
    missing_docs,
    clippy::missing_docs_in_private_items
)]
```

## The Ecosystem and Tooling help you

The rust tooling and ecosystem are so great and while rustc already provides you with awesome error messages, the following tools make development just so much easier:

- clippy (hints for your code)
- rust-analyzer (vscode rust language integration)
- cargo-all-features (test all optional features of your code)
- cargo-geiger (search for unsafe code in dependencies)
- tokei (loc counter)
