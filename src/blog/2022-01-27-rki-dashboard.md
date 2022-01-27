---
title: Opinion on the RKI COVID19 dashboard
abstract: |
  The Rober Koch Institut (RKI) in germany provides a dashboard via ArcGIS to provide an overview over the current state of COVID in the country.
  I have some opinion on this from a web dev point of view.
date: 2022-01-27
tags:
  - type:opinion
  - tool:LIT
---

{% rollup "assets/js/blog/2022-01-27-rki-dashboard/main.ts" %}

<div class="commentBlock">

## Disclaimer

This post is not about the pandemic situation itself. I'm neither a data scientist nor do I work in the medical sector.

I also want to mention that I highly appreciate the work of the RKI in even providing such a nice view on the data so it is accessible to everyone.

The following blogpost simply shows some thoughts of mine from a web developers point of view. I will implement some alternative visualizations. Those are just a different view and in general are probably not as useful as the one provided in the linked dashboard.

</div>

## Preface

Before reading this blogpost you should probably take a look at the [COVID Dashboard Germany](https://experience.arcgis.com/experience/478220a4c454480e823b17327b2bf1d4) created by the german Rober Koch Institut (RKI). It provides all necessary numbers and informations over the current and historical situation of the COVID-19 pandemic in germany.

All data is also available in an open [COVID 19 datahub](https://npgeo-corona-npgeo-de.hub.arcgis.com/search?groupIds=b28109b18022405bb965c602b13e1bbc).

## What is my problem with the dashboard?

It's actually really simple:

{% image "assets/img/blog/2022-01-27-rki-dashboard/Screenshot-rki-network.jpg", "Screenshot from the Chrome Dev Tools network panel showing 376 requests and 6.6MB of transferred data", [null] %}

<aside>

I know that Lighthouse reports aren't silver bullets, but they give a good indication of things and are also more or less reproduceable.

</aside>

As you can see, the dashboard loads massive amounts of data in many requests and takes over **ten seconds** to finish loading on my desktop pc with a wired broadband internet connection.

It gets even worse when we look at the desktop performance report. For some reason I even had to run the lighthouse tool about five times before even getting a result. The other times it either kept hanging or failed outright.

So now brace yourself, it's going to hurt:

{% image "assets/img/blog/2022-01-27-rki-dashboard/Screenshot-rki-performance.jpg", "Screenshot from the lighthouse performance", [null] %}

### But why is it so large?

The dashboard does a lot of things and also the components it uses are shared between dashboards and download other dependencies on their own. This leads to a JS payload of 2.1MB spread over 84 requests. This is 10.3MB of uncompressed JavaScript. At that point even the included React library isn't noticable anymore.

### Is that all why it is so slow?

Sadly: No.

If you take a closer look at the waterfall, you can see that it's a long linear flow. This is not good. In such a graph you would like to see strong vertical lines, since they mean that things are downloading in parallel. Here the requests trickle in nearly one by one and henceforth the download is spread out over a long time (since the dashboard is using h2, the number of connections is not a limiting factor).

{% image "assets/img/blog/2022-01-27-rki-dashboard/Screenshot-rki-waterfall.jpg", "Screenshot from the Chrome Dev Tools network panel showing bad request scheduling in the RKI Dashboard", [null] %}

Also downloading 169 request for data to display which result in 13.5MB of uncompressed data isn't exactly fast either.

This all leads to the following experience:

- after about **one second** the user can see a little **loading animation**
- after about **2.5 seconds** the user sees the **app shell** with the basic layout of all elements.
- after about **two more seconds** the first **simple data** (general 7-day incidence) comes in
- after **ten seconds** finally the application **finishes loading**

## Can it be faster?

Obviously, since I published this blogpost, I think it can be done faster. But it's easy to spit words, much harder to show something.

### Let's set some requirements

For this to be actually a viable solution and possible to implement in the context of this blogposts, I set some limitations and requirements for a solution:

1. Use the official data of the [RKI Datahub](https://npgeo-corona-npgeo-de.hub.arcgis.com/search?groupIds=b28109b18022405bb965c602b13e1bbc)
2. Always use the current data - noone likes data that is days old
3. Show the user the local, federal and nation wide 7-day incidence and total number of cases
4. Show the user the local, federal and nation wide 7-day incidence and total number of deaths
5. Show the user how many regions are above a certain incidence (local and federal)

### The dataset

To fullfill requirement 1. and 2., we'll use the [RKI Corona Landkreise](https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0) dataset, since it includes data for the local level and allows us to calculate federal and noation wide numbers. Also it's served with the correct CORS headers, so we can fetch it directly from the client.

Since we're only interested in the actual numbers and don't need the card data, we're going to use the [CSV](https://opendata.arcgis.com/api/v3/datasets/917fc37a709542548cc3be077a786c17_0/downloads/data?format=csv&spatialRefId=4326) version of the data, since it's "only" 160KB uncompressed to download. It's still larger than I would've liked, but since it's pretty compressable, we actually only transfer about 50KB over the wire.

### Used tooling

I will use [LIT](https://lit.dev) to achieve this. That way the resulting component could be embedded anywhere, since it's just a web component.

### The result

<covid-stats></covid-stats>

This is now implemented as a web component and in just about 130KB I can now present to you a small widget showing some of the most important COVID data for germany in a really performant way.

Oh did I mention that the 130KB includes the about 50KB of CSV and this whole blogpost? Take a look in the dev tools - the JS bundle for this page, that ships the web component and LIT is just under 30KB.

I will probably expand this post in the future and show some details about the code, but until then you can take a look in my github in the source of this blog: [GitHub Link to TS source fot this blogpost](https://github.com/Snapstromegon/hoeser.dev/tree/master/assets/js/blog/2022-01-27-rki-dashboard)
