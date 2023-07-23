---
title: Validating E-Mail Adresses
abstract: |
  If you're client side address validation is more than "contains an @", you're most likely wrong.
date: 2023-07-23
tags:
  - concept:E-Mail
---

## The Problem

I have a ".dev" domain (as you might have seen in the address bad of your browser). Sadly this often gets rejected by inputs with custom validation code as an invalid Mail address. In this post I will first show how not to validate addresses and then what to actually do.

## What not to do

The items below are all things I've seen recommended for checking addresses and I'll write why they're wrong.
This is an incomplete list, so if your check isn't on here, it doesn't mean it's right!

### Contains a dot in the domain

This is not right, because you can technically send a mail to a TLD (like a@com) and also IPv6 addresses (like `postmaster@[IPv6:2001:0db8:85a3:0000:0000:8a2e:0370:7334]`).

### TLD is two to X characters long

If you're not using 63 as X (the longest allowed TLD), you're doing it wrong. The longest currently defined TLD is `XN--VERMGENSBERATUNG-PWB`, which is 24 characters long.

### Only allow alphanumeric values in name or domains (plus dots)

You can use the comment syntax to apply tags to incoming mails like `a(comment)@(comment2)domain.org`. This is totally valid and you shouldn't deny this!

### Disallow spaces and other special characters

`"this.(),:;<>[]is\"a very@unusual mail!address"@valid.mail.com` is a valid address and so is `user%example.com@example.org`.

## What to do

Every singly consideration you do should IMO allow for all valid addresses. If you're unsure about your validation, don't enforce it. There's nothing wrong with just asking the user "are you sure" and accepting the response.

If you want to actually do it right, just check that the address contains an "@" symbol and then send a verification mail.
