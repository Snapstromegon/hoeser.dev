---
layout: layouts/main.njk
sitemapIgnore: true
theme:
  colorA: "#ff0"
  colorB: "#f00"
---

<header>
  <div class="content">
    <span class="underline_fancy">No Connection</span>
    <h1>It seems like you're offline!</h1>
  </div>
</header>
<main>
  <div class="content">
    <article>

# Go back online to continue reading

<script defer>
  window.addEventListener('online', () => location.reload());
  if(navigator.online) setTimeout(() => location.reload(), 1000);
</script>

  </article>
  </div>
</main>
