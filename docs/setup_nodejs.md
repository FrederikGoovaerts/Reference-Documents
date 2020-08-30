---
id: setup_nodejs
title: Setting up a Node.js project from scratch
sidebar_label: Project Setup - Node.js
---

This document aims to be a reference when setting up a project from scratch that has the following properties:

- It uses `npm` as a project tool
- It is a git repository
- The source code is written in TypeScript
- Unit tests are present using the Jest framework
- The source code can be transpiled and bundled using Rollup
- Linting with ESLint is present

## Prerequisites

See the [general prerequisites](/docs#general-prerequisites-for-practical-guides).

## Creating a project folder

In the development folder, use the `mkdir` command to create an empty folder and navigate to it in your terminal.

```
mkdir nodejs-project-setup
cd nodejs-project-setup
```

## Create git repository

Full reference material [here](https://git-scm.com/book/en/v2).

Setup up a new repository on a git repository provider of your choice (e.g. Github). We will push a locally created repository to the cloud provider instead of cloning a template repository, so make sure not to add any contents (e.g. README.md or gitignore) when creating the repository online.

After doing so, take note of the upstream URL. Then initialize an empty git repository in your new directory:

```
git init
```

Using `git status` should now tell you you are in a git repository on the `master` branch.

Add your upstream URL to the local repostory:

```
git remote add origin *upstream URL*
```

Add a `.gitignore` file with the following contents:

```
node_modules/
dist/
```

and make and push your first commit:

```
git add .gitignore
git commit -m "First commit"
git push -u origin master
```

Verify that your commit is correctly present on the repository provider. From now on, it is up to the reader to commit the necessary project files at regular intervals and push them.

## Creating an `npm` project

Full reference documentation [here](https://docs.npmjs.com/cli-documentation/).

Initialize a new `npm` project by running the following command and completing the prompts (when unsure, the defaults are sane and can be changed later):

```
npm init
```

Create an empty `package-lock.json` by doing an `npm install` if desired. We'll first add some simple code. Create a `src` folder in your new project folder, and add a `src/index.js` file with the following contents:

```js
const three = 3;

console.log(`The number is ${three}`);
```

Now add a new "script" in your `package.json`, called `start`. It should execute `node src/index.js`, which runs the code we just wrote in a Node.js runtime. You should now be able to run your code with

```
npm run start
```

## Adding TypeScript

Add the necessary dependencies to the project. The `@types/node` package should be pinned to the version of `node` that is present on your system. In this example it is pinned for Node.js 14:

```
npm install -D typescript ts-node @types/node@14
```

Now run the following command to create a `tsconfig.json` file with sane defaults:

```
npx tsc --init
```

Now change the extension on the `src/index.js` for to `.ts`. The "start" script will not work anymore since there is no more JavaScript code in our project to run in the Node.js runtime. We will use a TypeScript-compatible runtime called `ts-node` to run TypeScript code without transpiling first. Change the "start" script to `ts-node src/index.ts`. The script should now run the code again. Feel free to add some TypeScript-only constructs like typings to the `src/index.ts` file to make sure it cannot run in a normal Node.js runtime.

## Adding unit tests

Jest reference documentation [here](https://jestjs.io/docs/en/getting-started.html).
`ts-jest` reference documentation [here](https://kulshekhar.github.io/ts-jest/).

We'll introduce unit testing with the Jest framework. There are other options (Jasmine, Mocha), feel free to try setting those up yourself. Since we're using typescript, we'll have to decide to take [one of two approaches](https://jestjs.io/docs/en/getting-started.html#using-typescript): Using Babel to transpile the tests to JavaScript first and then running them in the normal Jest runtime, or using the `ts-jest` runner, which uses `ts-node` to typecheck and run the TypeScript tests. We'll go for the second option, but once again, feel free to explore the alternative yourself.

Install the necessary dependencies and create a basic config file:

```
npm install -D jest ts-jest @types/jest
npx ts-jest config:init
```

Now edit the "test" script in your `package.json` file to run the `jest` commmand. You can run this script with the shorthand `npm t` instead of `npm run test` if you want. Running the script now should throw an error that no tests are present which is indeed the case.

By default, `ts-jest` tries to find and run all files ending in `.spec` or `.test`, following by the extensions `.js(x)` or `.ts(x)`. Create a `test` directory and inside, create a `example.spec.ts` file with the following trivial contents:

```ts
describe("TypeScript", () => {
  it("should be able to sum two numbers", () => {
    const first: number = 1;
    const second: number = 2;
    expect(first + second).toEqual(3);
  });
});
```

Running the "test" script now will run your new test suite and succeed.

## Bundling the application with Rollup

Full Rollup reference [here](https://rollupjs.org/guide/en/).

At some point, we might want to deploy the application somewhere, and bundling helps, since it outputs one JavaScript file containing the whole application which can be run on any Node.js-capable system without having to set up and installing the project and dependencies.

Before getting in to setting up rollup, we will add a dependency to our application to verify correct bundling:

```
npm i lodash
npm i -D @types/lodash
```

Now change the contents of `src/index.ts` to the following to use the new dependency:

```ts
import flatten from "lodash/flatten";

console.log(
  `expecting ${JSON.stringify(flatten(["a", ["b"]]))} to result in ["a","b"]`
);
```

Now install Rollup and necessary dependencies into the project with:

```
npm install -D rollup @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-typescript tslib
```

We'll now introduce a Rollup config file, which uses the [Rollup TypeScript plugin](https://github.com/rollup/plugins/tree/master/packages/typescript) to transform our TypeScript file(s) and any used dependencies into one JavaScript file.

Create a `rollup.config.js` file in the root of the project with the following contents:

```js
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/index.ts",
  output: {
    file: "bundle.js",
    dir: "dist",
    format: "cjs",
  },
  plugins: [typescript()],
};
```

and add a "build" script to your `package.json` which runs `rollup -c ./rollup.config.js`.
