---
layout: layouts/main.njk
title: Home
eleventyNavigation:
    key: Home
    order: 1
---
# This is a test

This is a work in progress and doesn't contain anything useful yet.

I'm gonna write some clever content here in the future, but until then, why don't you take a look at my <a href="{{ (collections.all | eleventyNavigation("Posts") | last).url }}">latest post</a>?
