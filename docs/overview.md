---
id: overview
title: Overview
sidebar_label: Overview
slug: /
---

The documents hosted on this website are meant to offer a reference when tackling the topics below, either when practicing or in real situations. Currently, the covered topics are:

- [Setting up a new Node.js project using `npm`](/docs/setup_nodejs)
- [Setting up a new JavaScript browser library project using `npm`](/docs/setup_nodejs#addendum---setting-up-a-browser-library)
- [Setting up a new React project using `npm`](docs/setup_react)

## Recommendations when following these documents

- When command snippets are presented for a terminal, type these yourself instead of copypasting line by line. This will help you pick up the commands a lot faster. This does not apply to large code or command snippets. For large snippets, try to check line by line if you understand all the contents of the snippet before copy-pasting.
- When using `git`, unless you are comfortable setting up ssh keys and have correctly done so for your git repository provider of choice, consider using HTTPS for your repository for easier credential management.

## General prerequisites for practical guides

The practical guides expect a basic setup is present on the user's system. The guides can be used for any major platform as long as the following conditions are met:

- The system has a unix-like shell. On Linux and MacOS, this is trivially true. The easiest/most mainstream way for Windows is using Cygwin, which is already installed when Git for Windows is installed (look for the "Git Bash" application, which starts a terminal).
- `node` is installed on the system, along with `npm`. Verify this by running `node --version` and `npm --version` in a terminal. A recent version is recommended.
- `git` is present and correctly configured on the system. Verify this by running `git --version` in a terminal. All guides contain git CLI commands and it is recommended to get familiar with these to follow along more easily.
- The user has a designated folder where projects are kept and created, which will be referred to as "the development folder". This can be anywhere on your system as long as you can find it easily and it is not a protected or system folder.
- Using a suitable IDE of the user's choice is recommended. The guides try to be IDE-agnostic but are written mostly with Visual Studio Code in mind.
