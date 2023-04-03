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
    max-width: 50rem;
    gap: var(--l) var(--xxl);
    grid-template-areas: "greeting" "head" "feats";
  }

  #main-greeting picture {
    grid-area: head;
    /* filter: 
      drop-shadow(var(--xxs) var(--xs) var(--xxs) #0004)
      drop-shadow(calc(var(--l) * -1) calc(var(--l) * -1) var(--xxl) var(--theme-color-a))
      drop-shadow(var(--l) var(--l) var(--xxl) var(--theme-color-b)); */
  }
  
  #main-greeting h1 {
    font-size: var(--xxl);
    margin: 0;
    grid-area: greeting;
    align-self: end;
    text-align:center;
    font-weight: 200;
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
  
  @media not (hover: none) {
    .font-fun-letter {
      --add: 0;
      font-weight: calc(200 + 700*var(--add));
      font-stretch: calc(100% + 25%*var(--add));
      transition: transform .2s,font-stretch .2s,font-weight .2s;
    }

    .font-fun-letter:hover {
      --add: 1;
    }
    .font-fun-letter:hover+.font-fun-letter,
    .font-fun-letter:has(+.font-fun-letter:hover) {
      --add: 0.7;
    }
    .font-fun-letter:hover+.font-fun-letter+.font-fun-letter,
    .font-fun-letter:has(+.font-fun-letter+.font-fun-letter:hover) {
      --add: 0.45;
    }
    .font-fun-letter:hover+.font-fun-letter+.font-fun-letter+.font-fun-letter,
    .font-fun-letter:has(+.font-fun-letter+.font-fun-letter+.font-fun-letter:hover) {
      --add: 0.2;
    }
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

<h1>{%for letter in "Hi, I'm Raphael!"%}<span class="font-fun-letter">{{letter}}</span>{% endfor %}</h1>

- ⚡ performance hunter
- 📒 devops engineer
- 💻 compute enthusiast
- 🚀 automation evangelist
  </section>

## So what is this?

It took me years and multiple tries to start a blog. Every time I started, I learned a lot, tried new tech, got it launched and then... I had no idea what to write.

As it seems, this blog didn't stay empty and instead I wrote some of my thoughts down for the world. Have fun reading and if you want to comment, my social links are always open for questions and feedback!

  </article>
  </div>
</main>
