---
title: Offer your services on the web
abstract: |
  Every now and then I want to use some service that is only available as a native app.
  If this is your service, please stop and hear me out.
date: 2022-10-20
tags:
  - type:opinion
  - concept:pwa
  - concept:app
---

## I hate apps

There, I said it.

If you're building a service that one can only use as a native app, be sure that I will most likely skip it. It doesn't matter wether you're an automotive club in germany, Twitter or a small restaurant around the corner. If you want me to use your app instead of your website, I will be using your competitor.

## Some Nuance

Yes, I do use apps. Sometimes I even use apps when there are alternative services that have pure web versions. This is not because I prefer the app version though.

Among others I use these apps quite often:

- Maps
- WhatsApp
- YouTube
- PingTools
- Corona Warn App

What makes these different from other services? They often come preinstalled on my devices and I can't easily remove them and I still want to use the services (opposing to something like Facebook, which Samsung forced upon me and which I immediatly disabled) or it needs some level of hardware access the web just can't (and shouldn't) offer like with the CWA or PingTools.

But while I use these services as native apps, there are also services out there that offer native apps and I still prefer the web version over the app on a daily basis. Among these are:

- Mastodon
- Twitter
- Telegram
- Games like Proxx

## Downsides of native Apps

### Availabillity

Not everyone has a smartphone. Not even in "rich" countries.

For example in germany this year alone [over one million feature phones were sold][statista-feature-phones], which can't even run most native apps.
Even more so one in eight germans (ages 14 and up) [does not own a smartphone][statista-smartphone-users].

If you're building a service that only offers native apps for Android and iPhones, you're locking out all of these users from the start.

### Accessibillity

A11y is important and it's more than just supporting a screen reader or making text larger.

:::sidenote
Whoever thought it would be a good idea to call the official german ID App "Ausweis App 2" should be ashamed.
This looks as phishy as it could and makes it harder to find.
:::

Many people just prefer doing things on a desktop machine, especially if it's something official (looking at you "Ausweis App 2").

### Size

Native Apps are huge. Like "Twitter native is >70 MB" huge. If your device has limited storage, installing 10 apps can already get you in hot water.


## Benefit of going Web

Now that I had my time screaming my distaste into the void, let's look at the bright side of life.

### The inverse of the above

Obviously the mentioned downsides for native apps are benefits of web apps. They work everywhere and are way smaller (Twitter lite is only <2MB).

### Browser Sandbox

:::sidenote
Yes, I know that native smartphone apps also run in sandboxes nowadays, but this post applies the same way for many desktop apps.
:::

If I can decide wether I want top install a native or web app, my immidiate thought goes to security. While there are problems with executing untrusted JS on your devices, browsers have become quite secure and it's also another level of protection. So even if the vendor of my social media app decides to publish a malecious update, I'm quite sure that it won't start uploading all my images in the background or screen my contacts. Native apps (especially on desktop) have IMO way too many permissions by default, so installing a native app is just more of a risk to me and my privacy. And yes, even on Apple's ecosystem the app review isn't perfect.

### Speed

Yes, you read that right. If it's not an app that you're always using, it's likely that it will be faster to use (especially for startup times) when it's a PWA. This is, because a PWA builds on top of the OS browser and that's something you'll most likely already have running. That slashes startup time.

Also WASM has landed and offers near native performance and runs on everything from a AMD Threadripper to a tiny AVR.

### No install

A PWA is absically a website, so if you launch it for the first time and as a user don't yet want to commit to anything, you don't need to. There's no install and it just works.

### Ease of deployment

Updating your native app often evolves a process that isn't completely in your hands. Most often this is some kind of review by either Apple or Google which in turn might hold your apps for weeks at a time before releasing it into the wild and if you have a serious issue, it might break your users all together.

On the web on the other hand it's really easy. Most of the time your user can just reload if something isn't working and a patch will reach them nearly instantly (terms and CDNs apply).

### Just one platform

When you're doing native apps, you most often need one team for iOS, one for Android (or you're doing some wrapped Web stuff anyways) and one that makes you a website promoting your app.

Now imagine you'd just hire web developers and they build you a solution that works on all systems. It even includes Windows, Linux and MacOS desktop experiences.

### Discoverabillity

The use case that lead to this blogpost was me searching for an option to notify the state about potholes on the german autobahn. The ADAC (a german car club) has an app for this, that is only available as a native app.
First of all I don't expect to be reporting potholes on the autobahn every other day, so why would I commit to installing a native app for something that a webapp could do (including location services).
At that point in time I was already on their website and a simple form would've been more than enough for me to enter a report, but no, you'd need to download and install the native app, go in there, check permissions and only then you'd be able to use that service.

## Downsides of the PWAs

It can't be all roses.

### Hardware Access

While there are new standards for accessing hardware like WebSerial, WebNFC and WebBluetooth, but that's not everything you might need and that's okay. If you need more, feel free to build a native app.

### Users want Apps

This is kind of true - sadly. I personally believe this also is a chicken and egg problem. Most people think they want the app, because most app developers actively push for them. Even on sites like Twitter, which has a phenomenal PWA, they still show you banners that you should switch to the native app. If companies would start promoting their great websites correctly, I'd bet that web apps would be way more common.

### Apple

For reasons I can only speculate about Apple is more or less fighting real PWA support on iOS. This starts by only allowing their own browsers and goes on with dragging out or not supporting vital features. I think it's important that bigger companies start pushing for the web here. Players like Google and Epic showed in the past that even deploying "heavy" apps on the web is totally possible.

## The End

Finally, if you still think you and your company actually need native apps over web apps, take a look at [what web can do today][wwcdt] or [how to package PWAs for stores][package-pwas].

I've build several PWAs in the past (including this blog) ranging from a user base of just me to 10k+ and if I can do it, so can you.

[statista-feature-phones]: https://de.statista.com/outlook/cmo/consumer-electronics/telefonie/feature-phones/deutschland#volumen
[statista-smartphone-users]: https://de.statista.com/statistik/daten/studie/585883/umfrage/anteil-der-smartphone-nutzer-in-deutschland/#:~:text=Der%20Anteil%20der%20Smartphone%2DNutzer,oder%20Handy%20im%20Haushalt%20besitzen.&text=Fast%20jeder%20Deutsche%2C%20der%20unter,alt%20ist%2C%20nutzt%20ein%20Smartphone.
[wwcdt]: https://whatwebcando.today/
[package-pwas]: https://www.pwabuilder.com/