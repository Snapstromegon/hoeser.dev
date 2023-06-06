---
title: Code Reviews, don't make it personal
abstract: |
  As a professional developer submitting for and providing incoming changes code reviews is a fundamental task.
  There's a lot that can go wrong in this kind of communication and I want to shine a light on how to make it better from my perspective.
date: 2023-02-15
tags:
  - type:opinion
---

:::commentBlock
Like always, this post is based on my personal experiences and they are limited. If you have a working solution in your project that is different from what I describe here, it's completely fine and you don't need to change!

This post is more of a "food for thought" kind of ramble so you and I can reflect on our way of giving and receiving code reviews to improve ourselves.

Also please read it completely, because there might be sections that might appear toxic or asocial without further context.
:::

:::sidenote
My examples in this post show some opinions on coding guidelines. Don't take them too serious. You don't need to follow my example, use what your team/project is most comfortable with.
:::

## We are humans

Yeah, that's obvious, (except if you aren't, then please check if the following applies to you) and we make mistakes. If we wouldn't do mistakes, we wouldn't need code reviews at all and even though we make better tools now than 20 years ago to support developers, we still can't avoid all classes of mistakes.

It's important to keep this fact in mind, because everything you write in a code review is meant for another human to read and understand.

## Criteria for good code reviews

In this chapter I will describe some key aspects of a good code review and will provide examples of the difference between doing it right or wrong to give you some insights on why I think this is important.

### One aspect per comment

Sometimes you have more than one thing to note on a single line or you want to add a comment for something that is wrapped in a longer block that you're mainly commenting about. Often when I come across these, there's an urge to put multiple topics into one comment. **DON'T!**

Imagine this code:

```js
function greet(name = "World") {
  console.log("Hello " + name + "!");
}
```

Your first urge might be to comment something like this:

> I have two comments for this block of code.
> 1. Our coding guidelines say, that we should prefer arrow functions when possible and
> 2. It would probably be better to use JS template string instead of string concatenation.

I don't think this is good, because first of all this means that in the discussion thread you'll be arguing two topics in one thread and secondly as the author of the change you can't acknowledge just one of the two issues.

For example if the review made two comments like this:

> Please change this to an arrow function (`const greet = (name) => {...}`) to adhere to coding guidelines

> I would prefer template string (`Hello ${name}!`) over string concatenation for clarity reasons

...it would allow the author of the change to comment on both topics individually and also allows them to more easily state what they just agree with and where they want to have a discussion.

### Keep it short

This is meant for comments and feedback in your review system like GitHub or GitGerrit.

Let's say you have the following code to comment:

```js
const greet = (name) => {
  console.log(`Hello ${name || "World"}!`);
}
```

You could comment this either like this:

> I like your general approach to the problem and like always I appreciate your efforts in this project.
> Especially I like how you used console.log() directly and avoid indirection by moving it into an outer scope. We had some issues with this in the past and it's good that the code style improved so we can avoid those in the future.
> A single remark from my side. Maybe we could avoid using the `||` syntax here and instead use a default value for the name argument instead. This would probably make it much cleaner and also add the value as a visible default value in our IDE.

Or you could write instead:

> LGTM, just one nitpick:
> Please use a default argument value like this: `(name="World") => ...` so it shows up in IDEs as the default value.

This one says more or less the same, but with a lot less prose. This way reading und understanding what change I'd like to see as a reviewer and why is significantly easier and faster.

### Avoid long opinion threads

If you have this code:

```js
const greet = (name = "World") => {
  const greetingMessage = `Hello ${name}!`;
  console.log(greetingMessage);
}
```

You can debate wether or not the added variable `greetingMessage` adds clarity, or removes it. Both sides have arguments that are valid and most codebases I saw up to today also have no rules for this kind of thing.

:::sidenote
Not everything you do has to push you forwards, but when your target is to be productive, IMO it's good not to waste time by putting effort into something that is frustrating you at best.
:::

Going back and forth on this means, that both author and reviewer spend time on each interaction while not moving forward.
Also these debates tend to spawn longer and longer comments and also are very likely to move from an on topic to a personal debate.

My solution to these kinds of discussions is to pull in a third person. It's best when that third person is a peer that doesn't act with authority, but just provides another set of eyes.

**Important note:** The third person should either respond with a single A or B response, or if they really have a third opinion, they should take over this one review thread like they did the review in the first place. This way it's not three persons going back and forth on an (relatively) unimportant topic. Also the third person should not be briefed on the discussion aside from the existing thread to avoid personal influence.

Ideally a whole opinion based discussion could look like this:

> _A:_ I would prefer to directly pass the template string into console.log()

> _B:_ Thanks for the remark, but I believe that keeping greetingMessage as a separate variable adds clarity.

> _A:_ I see your point, but I think the indirection actually hurts clarity. @C, what do you think?

> _C:_ I think we should go with passing the template string directly into console.log()

### Don't debate rules in comments

If you have a coding guide that e.g. says to use `"` for strings instead of `'` and you receive this code for review:

```js
const greetWorld = () => {
  console.log('Hello World!');
}
```

It's totally fine to comment

> Please use `"` for strings as per our coding guidelines.

But this should be the one and only comment for such cases.

If the author disagrees with the coding guidelines and has no technical reason for using `'` here, a code review is not the place for discussing these things. This does not at all mean, that guidelines can't or shouldn't be changed, but I think that a code review is just not the right place for such a debate for multiple reasons:

- Only the author and the reviewer are part of the discussion
- This (probably long) discussion will block the change from getting merged
- A third party wouldn't know where to look for such guideline change proposals

I suggest to get a change merged adhering to the current guidelines and then take the "right" steps to discuss guideline changes. What these steps are depends on your project, team, company and tools.

### Don't make it personal

This is by far the most problematic mistake an individual can make in a code review.

:::commentBlock
If you ever worked with me in a professional setting, you know that this is one of the things I tell you in your first code review. I'm very strict and I will point out every nitpick, even if it means that I make 80 comments on your first ten line change.

It also means that you will probably need to do many revisions for your first commit to master, but it also means that nobody has to go back to that commit and "fix" it and your second commit will be to a better standard from the get go.

Giving all 80 comments at once also means that you can fix all of them with the first rework.
:::

:::sidenote
In case you'll ever review any of my code: Please be just as strict with me. Having an honest and objective debate about code in a review gives both the author and the reviewer options to learn and improve.
:::

A code review is about the code at hand. And only the code. No matter how harsh a reviewer's comments are, they should never be influenced by any personal sympathy or previous code.

On the same note, an author should never take a code comment personal. I can shred your code to pieces in a review in the morning and ask you to join me in a bar later that night, the same way I might praise your code in a review and never see you anywhere else.

Making this divide in my opinion is critical, because not doing that either ruins a team or means that nobody gives honest criticism in fear of hurting someone personally.

Giving strict code reviews also means that both sides can find opportunities to learn.

### Stay on topic

A code review is about the code at hand (_... I think I already used this one..._). The code in this MR/PR/CR/whatever you call a change in your version control.
Do not move discussions away from that by bringing in unrelated topics.

### Write actionable comments

Let's go back to this earlier code example:

```js
const greet = (name) => {
  console.log(`Hello ${name || "World"}!`);
}
```

Imagine you wrote this code as an author and got this review:

> I don't like what you did with "World" here.

This isn't helpful, but let's dissect why.

"I don't like ..." clearly states that the main argument for this discussion is a feeling (this isn't bad in general, but objective criticism is normally easier to act upon).

"what you did with "World" here" also doesn't really name the issue at hand. Clearly it's around the string `"World"`, but is the problem the way of doing string concatenation or the double pipe operator or the way the default value is applied? Who knows?

As a reviewer every comment should be actionable. As an author I should always know where to look next or what to do to move the discussion forward. This doesn't mean that a reviewer has to always tell the answer, but at least bring up a question that you want to answer or a problem you see like

> When I use the IDE hints, it doesn't show that "World" is the default name. Is there a way to get this to show up correctly?

This comment clearly states a problem and while the solution is unknown, it tells the author where to look next.

_(By the way, the same is true for replies back to the reviewer.)_

### Code reviews are a discussion

It's okay to have longer discussions in code reviews, as long as they don't derail. The reviewer isn't automatically right with every comment and the author is allowed to argument their side. While the reviewer might look at the problem with a fresh state of mind, the author already spend time analyzing the problem and can say why they made some considerations.

Also it's very likely that both sides will take something positive from a good discussion, so don't shy away from them.

### Mention Positives

This is especially for reviewers: If you find something remarkable you like in a change, mention it.
This has multiple benefits, as it gives positive reinforcement and also breaks the habit of "searching for errors".
While code reviews are often about avoiding mistakes getting into your main branch, they are (as mentioned previously) a place for discussion and feedback and it's absolutely vital to also provide feedback for positive things.

I tend to force myself to find at least one thing I really like about every change I review. This can be something particularly elegant or a fix that wouldn't be needed or some performance improvement. For me this forces me to switch the pair of glasses I look through and actively search the positive. Often I will even find some edge case bugs with this.

### Ask questions

The author and the reviewer are humans. Both sides make mistakes and both sides don't know everything.

As the reviewer you can always add a comment something just to ask for clarification (note to author: in these cases look into adding the explanation as a comment in your code) and as the author you might want to add first comments to your code even before the first review round. This could be something like "do you think this [operation] will work long term?".

### Never play authority

It's most likely that either the author or the reviewer have some kind of (perceived) authority over the other like being longer at the company / in the position, being older or being "higher up". All of these shouldn't matter in a code review. If you need to pull the "power card" to get what you "want" in a code review, you most likely can't argument your point.
This can either be because the point has no argument (in which case you're definitely not automatically right) or you don't know how to express your argument, which is not a great sign for someone who considers themselves as a person with authority.

Also be aware that you might seem like you're playing authority when you aren't. Especially as a reviewer be very clear to your reviewed that you're not automatically right and that e.g. if you ask a question it's not a rhetorical "please fix", but an honest question.

### Resolve threads with answers

If you start a discussion thread and move the discussion offline, remember to go back and resolve the thread with an answer/decision and reasoning for future reference. That way others can learn from your reasoning.

It can be as simple as:

> After a meeting option B was chosen here, because [argument1] and [argument2].

## And now go review

I hope these guidelines help you to improve the way you give and receive code reviews. As something that's so core to our daily business, it's shocking to me how many make simple mistakes.

And just to say it again: There's always room for private discussions and deep opinionated talk about coding guidelines or personal relations, but in my opinion that room is not a code review.

A good code review is a place where a third person can go back to, look at, understand both sides and see why a decision was made.
