---
layout: layouts/main.njk
theme:
  colorA: "#0cf"
  colorB: "#f35"
eleventyNavigation:
  key: Home
---

<section class="devider">
  <a href="{{ collections.posts.last.url }}">
    <div class="content">
      <span class="underline_fancy">My latest Blogpost</span>
      <h1>{{ collections.posts.last.data.title }}</h1>
    </div>
  </a>
</section>
<main>
  <div class="content">
    <article>

# Hello World

It took my years and multiple tries to start a blog. Every time I started, I learned a lot, tried new tech, got it launched and then... I had no idea what to write.

This time I already have some things in mind to give me a headstart, so this won't stay empty. Keep an eye out for the webdev-sins series, where I will be blatently trumpet my opinion and then elaborate on why I think something is not right. But keep in mind I'm not allmighty and only human, so if you disagree or have an own opinion - let me know!

  </article>
  </div>
</main>