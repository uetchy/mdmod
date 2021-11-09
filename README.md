# mdmod

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]
[![Actions Status: test](https://github.com/uetchy/mdmod/workflows/test/badge.svg)](https://github.com/uetchy/mdmod/actions?query=test)

[npm-version]: https://badgen.net/npm/v/mdmod
[npm-downloads]: https://badgen.net/npm/dt/mdmod
[npm-url]: https://npmjs.org/package/mdmod

> Powerful & extensible Markdown fragment editor.

## Features

- Programmatically update portion of Markdown document (Table of Contents, package index for Monorepo, version number in the installation guide, etc)
- [Plugins](#official-plugins) to extend its usage

## Install

```bash
npm i -g mdmod
```

## Use case - update version string in the installation guide

Suppose we are about to update the README.md for the latest version `v6.0.0`.

Define a block starting with `<!-- START mdmod -->` and with a trailing `<!-- END mdmod -->`, and then pass the option as an object, where `match` is `/v\d\.\d\.\d/g` and `replace` is `version`.

````md
<!-- START mdmod {match: /v\d\.\d\.\d/g, replace: version} -->

```
curl https://path/to/releases/v0.4.0.tar.gz
tar -zxvf v0.4.0.tar.gz
```

<!-- END mdmod -->
````

Run `mdmod` with a variable `version` set `v6.0.0`:

```bash
mdmod README.md --define.version v6.0.0
```

This will replace all the string matched `/v\d\.\d\.\d/` with the content of `version` defined in the CLI argument:

````md
<!-- START mdmod {match: /v\d\.\d\.\d/g, replace: version} -->

```
curl https://path/to/releases/v6.0.0.tar.gz
tar -zxvf v6.0.0.tar.gz
```

<!-- END mdmod -->
````

## Configuration

### MdmodOption

```ts
{
  replace: (() => string) | string,
  match?: RegExp,
  use?: string | [string, string]
}
```

- **replace**: function or variable or string literal to replace with
- **match** (optional): regular expression to match text. Without `match`, mdmod will replace whole text.
- **use** (optional): specify plugin to use. If `use` property is given, other options will be ignored. If relative path is given (e.g. `use: "./scripts/contributors.js"`), use the specified script as a plugin. You can pass args to a plugin like this: `use: ["somePlugin", {foo: "bar"}]`

See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to write a plugin.

### Start of block

```
<!-- START mdmod MdmodOption -->
<!-- START mdmod [MdmodOption, MdmodOption, ...] -->
```

### End of block

```
<!-- END mdmod -->
```

### Environment variable

Instead of using `--define.<key>=<value>`, you can also define a variable with exporting environment variable `MDMOD_<key>`. `<key>` will be lowercased and added to the VM's constant dictionary.

## Official Plugins

### Table of Contents ([`mdmod-plugin-toc`](https://github.com/uetchy/mdmod-plugin-toc))

Generate a table of contents.

```bash
npm i -g mdmod-plugin-toc
mdmod README.md
```

```
<!-- START mdmod {use: 'toc'} -->
<!-- END mdmod -->
```

would produce:

```md
- [mdmod](#mdmod)
  - [Features](#features)
  - [Install](#install)
  - [Example Usage](#example-usage)
  - [Configuration](#configuration)
    - [MdmodOption](#mdmodoption)
    - [Start of block](#start-of-block)
    - [End of block](#end-of-block)
    - [Environment variable](#environment-variable)
  - [Official Plugins](#official-plugins)
    - [Table of Contents (`mdmod-plugin-toc`)](#table-of-contents-mdmod-plugin-toc)
    - [Table of Packages (`mdmod-plugin-top`)](#table-of-packages-mdmod-plugin-top)
  - [Usage Tips](#usage-tips)
    - [Sync version text in README.md with the latest `git tag`](#sync-version-text-in-readmemd-with-the-latest-git-tag)
    - [Automated workflow with `husky` and `lint-staged`](#automated-workflow-with-husky-and-lint-staged)
```

### Table of Packages ([`mdmod-plugin-top`](https://github.com/uetchy/mdmod-plugin-top))

Generate a list of monorepo packages (`/packages/*`).

```bash
npm i -g mdmod-plugin-top
mdmod README.md
```

```
<!-- START mdmod {use: 'top'} -->
<!-- END mdmod -->
```

would produce:

````md
### [pkg1](packages/pkg1)

testPackage

[![](https://img.shields.io/npm/v/pkg1.svg)](https://npmjs.com/package/pkg1)
[![npm: total downloads](https://flat.badgen.net/npm/dt/pkg1)](https://npmjs.com/package/pkg1)
![npm: license](https://flat.badgen.net/npm/license/pkg1)

```bash
npm install --save pkg1
# or
yarn add pkg1
```
````

### GitHub Sponsors ([`mdmod-plugin-github-sponsors`](https://github.com/uetchy/mdmod-plugin-github-sponsors))

```bash
npm i -g mdmod-plugin-github-sponsors
mdmod README.md --define.owner uetchy
```

```
# Sponsors

<!-- START mdmod {use: 'github-sponsors'} -->
<!-- END mdmod -->
```

would produce:

```md
# Sponsors

<!-- START mdmod {use: 'github-sponsors'} -->

[<img src="https://avatars.githubusercontent.com/u/6936373?u=4edd14e6636c45d10ac6a3eecb4b3ffa6cc2bf5c&v=4" width="35" />](https://github.com/Naturalclar) [<img src="https://avatars.githubusercontent.com/u/79023920?v=4" width="35" />](https://github.com/Lierin8oracle)

<!-- END mdmod -->
```

## Usage Tips

### Sync version text in README.md with the latest `git tag`

```bash
npx mdmod README.md --define.version $(git describe --tags --match 'v*' --abbrev=0)
```

`README.md`:

````md
# Download

<!-- START mdmod {match: /v\d\.\d\.\d/g, replace: version} -->

```bash
curl -LO https://github.com/uetchy/mdmod/archive/v0.4.0.zip
unzip v0.4.0.zip
```

<!-- END mdmod -->
````

### Automated workflow with `husky` and `lint-staged`

```json
{
  "husky": {
    "pre-commit": "lint-staged"
  },
  "lint-staged": {
    "*.md": ["mdmod"]
  }
}
```

## Showcase

List of awesome projects that use mdmod.

- [Tencent/cloudbase-framework](https://github.com/Tencent/cloudbase-framework)
