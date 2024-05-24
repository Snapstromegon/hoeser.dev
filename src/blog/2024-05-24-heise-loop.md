---
title: Heise inits everything
abstract: |
  Sometimes even big tech players like Heise.de have some issues.
date: 2024-05-24
tags:
  - lang:JS
---

```js
function initTags(e) {
    var t = this
        , n = function() {
        e.subscriptionManager.storageManager.getTags().then((function(n) {
            var i = e.config.channelTags;
            checkTags(i, n, e.tagSubscription.bind(t), e.waitForSubscription.bind(t), location.pathname)
        }
        ))
    };
    e.config.trackTagsOnlyWhenTopicEnabled && e.config.trackTagsOnlyWhenTopicEnabledIds.length ? e.subscriptionManager.storageManager.getTopics().then((function(t) {
        e.config.trackTagsOnlyWhenTopicEnabledIds.every((function(e) {
            return t.includes(e)
        }
        )) ? n() : e.once(Event.TOPICS_SET, initTags(e))
    }
    )) : n()
}
```