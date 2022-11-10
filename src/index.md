---
layout: layouts/main.njk
theme:
  colorA: "#0cf"
  colorB: "#f35"
eleventyNavigation:
  key: Home
  order: 1
---

<style>
  #main-greeting {
    display: grid;
    gap: var(--l) var(--xxl);
    grid-template-areas: "greeting" "head" "feats";
  }

  #main-greeting picture {
    grid-area: head;
  }
  #main-greeting h1 {
    font-size: var(--xxl);
    margin: 0;
    grid-area: greeting;
    align-self: end;
  }

  #main-greeting li {
    padding: var(--xxs) 0;
    list-style: none;
    white-space: nowrap;
    text-transform: capitalize;
  }

  #main-greeting ul {
    padding: 0;
    column-width: 11rem;
  }

  @media (min-width: 40rem) {
    #main-greeting {
      grid-template-columns: 20rem 1fr;
      grid-template-rows: auto auto;
      grid-template-areas: "head greeting" "head feats";
    }
  }
</style>
<header>
  <a href="{{ (collections.blogposts | last).url }}">
    <div class="content">
      <span class="underline_fancy">My latest Blogpost</span>
      <h1>{{ (collections.blogposts | last).data.title }}</h1>
    </div>
  </a>
</header>
<main id="main-content">
  <div class="content">
    <article>
      <section id="main-greeting">
{% image "assets/img/head.png", "My face in some colorly blobs" %}

# Hi, I'm Raphael

- ⚡ performance hunter
- 📒 working student
- 💻 compute enthusiast
- 🚀 automation evangelist
  </section>

## So what is this?

It took me years and multiple tries to start a blog. Every time I started, I learned a lot, tried new tech, got it launched and then... I had no idea what to write.

As it seems, this blog didn't stay empty and instead I wrote some of my thoughts down for the world. Have fun reading and if you want to comment, my social links are always open for questions and feedback!

  </article>
  </div>
</main>
