---
title: Everything is becoming Chrome
abstract: |
  Chrome (and Chromium browsers) make the lion share of the modern web userbase. Today one of the Safari Web Developer Experience Evangelists painted a distopian image of a 95% Chromium browser world. Since it's coming from the Safari team, I want to write my opinion on this.
date: 2022-02-07
tags:
  - type:opinion
  - tool:Browsers
---

:::commentBlock

## Disclaimer

This post is not about the individuals involved or mentioned. Regardless of me speaking positively or negatively about certain quotes of the individuals mentioned here, they are not representative of my general opinion of the work by these people or the individuals themselves.

This piece should've been a tweet response, but <del>140</del> <ins>280</ins> characters are just not enough to express a nuanced opinion.

:::

## My general opinion on Safari (on iOS)

I think Apple is holding back the web.

:::sidenote
Safari probably has some of the best engineers working on it and we can appreciate their work time and time again when they push such amazing features like backdrop-filter.
:::

Apple has decided time and time again to underfund the development of Safari and there's the joke among web devs that the fastest way to get a feature in to Safari, is to join the iTunes team, since it uses webkit (Safari's engine) under the hood and if iTunes wants a feature, it gets implemented.

I don't think this is true, but that this even offers the option for a joke speaks a lot for the current situation of Safari development.

As a WebDev myself who on one side loves playing with new stuff like WebBluetooth or WebNFC and on the other thinks that PWAs are the future, Safari has become a real pain point for me. Not only that Safari is the only real browser on iOS (more details later), it's also not available on any device for me. I don't own a Mac or i-Device. So every time I want to test something in Safari I have to track someone down (finding someone with an iPhone is fairly easy, but getting my hands on a Mac is not so easy) and even then debugging Safari isn't exactly what you'd call a good developer experience.

### Avoiding competition

Apples AppStore rules don't allow other browser engines than the build in WebKit engine. Therefore all other browsers in iOS use that engine and are basically just Safari with a new skin. This leaves two options for other browsers on iOS:

:::sidenote
Competition is important - especially in the tech space - even more so in a space that's driven by open standards and has such a painful history like Internet Explorer
:::

1. Call Apple out and with that say that Safari will always be at least as good as a browser on iOS than yourself - so probably fewer people would switch away from the default browser to your third-party browser
2. Go with what Apple does, hide it from the user and henceforth allow this to continue in the future which brings other issues with it like issues for WebKit bugs in the Chromium bugtracker

All this means that iOS is the only major platform out there which doesn't allow competition in the browser market.

## Context for this blogpost

The awesome [Jen Simmons](https://twitter.com/jensimmons) who "is an Apple Evangelist on the Web Developer Experience team and a member of the CSS Working Group" and did a lot of awesome work e.g. around CSS Grid and Intrinsic Layouts (watch her talks, they are great and I nearly forgot - go give her a thanks for `aspect-ratio`!) tweeted about how "there seems to be an angry pocket of men who really want Safari to just go away" ([source](https://twitter.com/jensimmons/status/1490747578526404608)).

:::sidenote
I mainly mention the employer of the people here, so you can easily see who they are working for and how that might influence their opinion. They can have their own opinion and shouldn't be punished for it!
:::

As far as I saw on twitter, this is probably (not completely wrongly) directed at many people pushing to write to the regulatory bodies of the US and UK which have an upcoming decision on the #AppleBrowserBan (read more in [Bruce Lawson's post "One week left to save the Web!" here](https://brucelawson.co.uk/2022/one-week-left-to-save-the-web/)). This was also further spread by many (mostly male) figures of the web development community like in tweets by Google's [Jake Archibald](https://twitter.com/jaffathecake) ([Tweet spreading this](https://twitter.com/jaffathecake/status/1489503832124141571)) and Microsoft's [Alex Russel](https://twitter.com/slightlylate) who [spread](https://twitter.com/slightlylate/status/1490067450339024896) [this](https://twitter.com/slightlylate/status/1490129134571323394) [multiple](https://twitter.com/slightlylate/status/1490416540927160322) [times](https://twitter.com/slightlylate/status/1490579373707051009).

Especially in Alex Russel's case writing against Apple's behavior as a citizen on the web became kind off a common thing like when he wrote about Apple that [Progress Delayed Is Progress Denied](https://infrequently.org/2021/04/progress-delayed/) (go read this, I'll use it as context further along).

### Two extremes hitting each other

As someone who neither works on Chromium nor WebKit (nor any other engine) to me this seems like Jen on the one side saying "if we go, then everything will be Chrome and we're back to the days when IE ruled the web" and Alex and Jake on the other side saying "if Apple allows other engines it will finally give them an incentive to competitevely invest in the browser and if they don't, then it should go down" (both sides oversimplified here).

Either one of these I think is unrealistic. Also both sides IMO miss the point.

:::sidenote
I hope we're all aware that single individuals like Jen Simmons don't decide on how Apple allocates its monetary ressources
:::

I think we all agree that the web can be its best when we have many stakeholders with equal weight in the ring and even better when they work together. Jen Simmons is a shining example of this with her work in the CSS Working Group. Nonetheless I think that Apples walled garden is hurting the web and even if Apple would open up the gates, I don't believe that "users would flock away from Safari" like [Jake Archibald tweeted](https://twitter.com/jaffathecake/status/1490771255435403267). I know too many people who actually like Safari and for the average user it's not a bad browser. Apple knows how to do polished UX and it shows.

But I also think that e.g. more advanced features around PWA implemented by other browsers would give Apple more incentive to implement those too on their platform, so all users benefit from the added competition.

Regarding the other side, I believe that hating against Apple like it's sometimes done isn't helping either ([here I've kinda done it myself](https://www.reddit.com/r/webdev/comments/rek02n/chrome_and_firefox_draw_text_underlines_beneath/ho8xggu/?context=3)). Especially when it's directed against individuals working on WebKit or Safari. **Noone deserves hate for this kind of work!**

Stating that Safari is a lost cause or that Safari will easily make a return once there is competition isn't true either. First of all developing and maintaining a browser is _expensive_, like _Microsoft doesn't want to do this_ kind of expensive. Having Apple actively maintaining Safari to the current state is remarkable, but like I mentioned before, in relation to its revenue it's a shame.

Speaking of revenue. I see the strong incentive for Apple executives to keep the Web small on iOS, since the AppStore revenue with its 30% cut is a giant income opportunity, which doesn't have an equivalent on the web.

## Is a "Chromium-Only" web a dystopian idea?

**YES, but...**

...I think that the current walled garden on iOS is also really dystopian.

:::sidenote
Confession: I was one of the few users who actually installed Safari for Windows back when that was a thing. And I liked it as a secondary browser.
:::

I would hate to see another browser engine go and although I'm writing this in a Chromium based editor, next to my Google Chrome as a preview window while a Chrome PWA is playing music in the background, I think other engines are important.

Mozilla with Firefox does amazing work. It's also not jumping every trend that Google wants to go, which sometimes is a bummer for me, but it's also often the spec compliant browser, when I compare different behavior in Chrome and Firefox with the specs (sorry Safari, you're just not available to me anymore).

I believe that if Apple opens up iOS for other engines, It will create an impact in Safari's market share and also Apple's AppStore revenue. But I also believe that Safari will receive more spending and maybe even a revival of the non-Apple distributions (although I doubt this).

## Adressing some common topics in this discussion

### Safari is more secure

No it isn't, especially because it's (on iOS) part of the OS, so it only get's updated with the OS and exploits in Safari are way more dengerous than if it were running as a simple application.

### Chromium is the best browser, wouldn't it be good if everything were like it?

Absolutely not. Examples like the history of IE and more recently how Google pushed and handled AMP pages showed, that single players gaining too much power are hurting the ecosystem. We need consensus on the direction of the platform, even better, a stage where even small developers like I am can voice their opinion like I did on [retrying failed dynamic imports](https://github.com/tc39/proposal-dynamic-import/issues/80).

### Apple does this to protect users privacy

Google is a marketing company and we saw the influence of this in their standards work in the past (like last with FLoC). Not listening to Google can be the right decision, but privacy also is not a catch all pass. One argument often brought against new Fugu APIs is browser fingerprinting, but the pure availability of features, especially on such large groups of similar devices like iPhones, probably doesn't improve fingerprintability by much.

On the other hand I think that if a user is invested enough in a website to allow it access to Bluetooth or NFC, the trust is deep enough that fingerprinting is no longer a real concern.

## Some final words

It's nearly midnight now and I've rewritten this now twice, removing ramblings and off topic comments. Nonetheless I want to boil this article down into some few words directed at all parties in this discussion.

I believe that

- the web will continue to evolve no matter how Google, Apple, Microsoft or any other entity acts
- Apple opening up it's platform for other engines would improve the situation for the web and Safari
- having single players with too much force on either a single platform or the whole web is dangerous
- although the engineers behind Safari do awesome work, Apple needs to strengthen its investment here
- no individual should be attacked personally over decisions made by corporations

This was probably a lot to take in.

[Jen Simmons (@jensimmons)](https://twitter.com/jensimmons), [Jake Archibald (@jaffathecake)](https://twitter.com/jaffathecake), [Alex Russel (@slightlylate)](https://twitter.com/slightlylate) and [Bruce Lawson (@brucel)](https://twitter.com/brucel) since I quoted and criticized your tweets and work here, I wanted to thank you once again for your positive contributions to the web platform as a whole.
