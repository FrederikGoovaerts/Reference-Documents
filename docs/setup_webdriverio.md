---
id: setup_webdriverio
title: Setting up WebdriverIO for browser automation
sidebar_label: Tool Setup - WebdriverIO
---

This document shows how to set up and use [WebdriverIO](https://webdriver.io/), a Node.js client implementation for the [WebDriver](https://www.w3.org/TR/webdriver/) protocol.

## Prerequisites

See the [general prerequisites](/docs#general-prerequisites-for-practical-guides).
This guide assumes starting out with a functional `npm`-based project with at least TypeScript and `ts-node` installed.

For this document, we will use a separate test page. To follow along with the exact examples, save the HTML below into a file:

```html
<head>
  <title>Testpage</title>
</head>
<body>
  <script>
    function increase() {
      document.getElementById("counter").innerText =
        Number(document.getElementById("counter").innerText) + 1;
    }

    function reset() {
      document.getElementById("counter").innerText = 0;
    }

    function set(value) {
      document.getElementById("counter").innerText = value;
    }
  </script>
  <button id="increase" onclick="increase()">Increase</button>
  <span>The counter is currently:</span><span id="counter">0</span>
</body>
```

and serve it. This can be easily achieved e.g. with the [http-server](https://www.npmjs.com/package/http-server) npm package. The page itself has a button to increase a value that is shown on the page. There are also some functions predefined to modify the value.

This document assumes the page is hosted as `https://localhost:8080/counter.html`.

## Install WebdriverIO

Full reference [here](https://webdriver.io/docs/gettingstarted.html).

Open your project folder in a terminal and execute

```
npm i --save-dev @wdio/cli
```

to install the base package of WebdriverIO as a `DevDependency`. Running the configuration tool with

```
npx wdio config
```

will set up a basic configuration and install additional packages. Choose whatever configuration matches your setup. The guide assumes the choice of a local testing backend and `jasmine` test framework with asynchronous commands and Typescript. When asked to add services, feel free to pick the `selenium-standalone` service.
Any other service or configuration option is a possibility, but this guide will not always match your configuration then. Installing the `selenium-standalone` service later can be done according [to the official documentation](https://webdriver.io/docs/selenium-standalone-service.html).

The configuration process might tell you to add types to your `tsconfig.json` file. It is advised to do so or typing errors will pop up later. It might be necessary to install `@types/jasmine` separately.

## Adding a PageObject for the test page

WebdriverIO encourages the use of the [Page Object pattern](https://martinfowler.com/bliki/PageObject.html). We'll create an adapter for our test page to hide the underlying WebdriverIO calls from the actual tests.

Add a file with the following contents as `test/pageobjects/counter.page.ts`:

```ts
class CounterPage {
  get button() {
    return $("#increase");
  }
  get counter() {
    return $("#counter");
  }

  async getCounterValue(): Promise<number> {
    return Number(await (await this.counter).getText());
  }

  async clickButton(): Promise<void> {
    await (await this.button).click();
  }

  async open(): Promise<void> {
    await browser.url("counter.html");
  }
}

export default new CounterPage();
```

Feel free to look up the used WebdriverIO API in the [API docs](https://webdriver.io/docs/api.html), though most of this logic will be self-explanatory. The class `CounterPage` functions as an interface for the test page itself. If the page itself ever changes, we can change the logic of the PageObject instead of having to fix every test manually.

Since this class is a stateless wrapper for WebdriverIO API, we will default export an instance that will be used in the tests.

## Adding tests for the UI

We can now write a simple test using our Page Object and the testing framework we selected during setup. Add a file as `test/specs/counterPage.spec.ts` with the following content:

```ts
import CounterPage from "../pageobjects/counter.page";

const INITIAL_VALUE = 0;

describe("The counter page", () => {
  beforeEach(async () => {
    await CounterPage.open();
  });

  it("should have the correct initial value", async () => {
    expect(await CounterPage.getCounterValue()).toEqual(INITIAL_VALUE);
  });

  describe("when the button is clicked", () => {
    beforeEach(async () => {
      await CounterPage.clickButton();
    });

    it("should increment the counter once", async () => {
      expect(await CounterPage.getCounterValue()).toEqual(INITIAL_VALUE + 1);
    });
  });
});
```

The page object allows for easy reading of the test implementation and keeps the test code compact.

## Running the tests

The main problem when writing these tests in TypeScript is that WebdriverIO does not handle running TypeScript code. The easiest way of working around this is by transpiling the test code before running.

In `tsconfig.json`, add `"outDir": "./out"` to the `compilerOptions`, which will separate the transpiled code from the source code for easier cleanup.

Install `rimraf` as a `DevDependency` and add the following scripts to your `package.json`:

```
"scripts": {
  ...
  "compile": "tsc",
  "clean": "rimraf out dist",
  "wdio": "npm run compile && wdio && npm run clean"
},
```

Running the `wdio` script should open up a browser and succesfully run your tests. By default, WebdriverIO generates a config file that runs tests in Chrome. You could add Firefox as a test target by tweaking the `wdio.conf.js` file with the following:

```
capabilities: [
  {
    maxInstances: 1,
    browserName: 'chrome'
  },
  {
    maxInstances: 1,
    browserName: 'firefox'
  }
]
```

## Adding tests for extra page API

We've not written tests for the function `reset` and `set`, that are not linked to any UI element. A good choice in this case would be to add this functionality to the Page Object. On the other hand, in the situation that you are testing a page that has a lot of JavaScript logic, it might be necessary to perform a lot of javascript logic in certain tests that is never reused, making the Page Object boilerplate more work than the actual logic.

In this case, you could use `browser.execute()` or `browser.executeAsync()` directly in a test to wrap a block of JavaScript. An example:

```ts
...
const SET_VALUE = 404;

describe('The counter page', () => {
  ...

  describe('when calling setValue', () => {
    beforeEach(async () => {
      browser.execute((value: number) => {
        // @ts-ignore
        set(value);
      }, SET_VALUE);
    });

    it('should set the counter to the provided value', async () => {
      expect(await CounterPage.getCounterValue()).toEqual(SET_VALUE);
    });
  });
});
```

Since `browser.execute()` and `browser.executeAsync()` send over the block of code to be executed to the browser, local variables outside the scope of the executed function are not available to the function and should be passed as parameter, as is done with `SET_VALUE`.

Do note the `// @ts-ignore`. Seeing as TypeScript can't differentiate what code is present on the test page, it doesn't know that a `set` function exists. You could tackle this by adding a [declaration file](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html) with the test page logic to your project, but this is not a silver bullet: TypeScript will also allow you to "call" those functions outside of any `browser.execute()` or `browser.executeAsync()`, so take care. On the other hand, debugging such problems is not hard.

## Takeaways

- Browser Automation is a good way to test a live page in its entirety, as a user would use it.
- The Page Object pattern helps to keep tests readable and maintainable.
- WebdriverIO tests are not necessarily related to the code in the repository, but rather load a page in a browser and perform tests on it.
