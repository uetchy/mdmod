# mdmod

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]
[![Actions Status: test](https://github.com/uetchy/mdmod/workflows/test/badge.svg)](https://github.com/uetchy/mdmod/actions?query=test)

[npm-version]: https://badgen.net/npm/v/mdmod
[npm-downloads]: https://badgen.net/npm/dt/mdmod
[npm-url]: https://npmjs.org/package/mdmod

> In-place string replacement for Markdown

<!-- START mdmod {use: 'toc'} -->

- [mdmod](#mdmod)
  - [Features](#features)
  - [Install](#install)
  - [Use](#use)
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

<!-- END mdmod -->

## Features

- In-place string replacement.
- [Plugins](#plugins) to extend feature.

## Install

```bash
npm i -g mdmod
# or `npm i mdmod` to install mdmod locally
```

## Example Usage

Run `mdmod` with a variable named `version`:

```bash
mdmod README.md --define.version v6.0.0
```

Replace a block in between `<!-- START mdmod -->` and `<!-- END mdmod -->` with content of a defined variable `version`:

```md
<!-- START mdmod {replace: version} -->

v0.4.0

<!-- END mdmod -->
```

Replace all matched text with content of a defined variable `version` with trailing `-p0`:

```md
<!-- START mdmod [
  {match: /v\d\.\d\.\d/g, replace: () => version + "-p0"}
] -->

curl https://path/to/releases/0.4.0.tar.gz
tar -zxvf 0.4.0.tar.gz

<!-- END mdmod -->
```

## Configuration

### MdmodOption

```ts
{
  replace: (() => string) | string,
  match?: RegExp,
  use?: string
}
```

- **replace**: function or variable or string literal to replace with
- **match** (optional): regular expression to match text. If null, replace whole text.
- **use** (optional): specify plugin to use. If `use` is given, other options will be ignored. If relative path is given (e.g. `use: "./scripts/contributors.js"`), use the specified script as a plugin.

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

Instead of using `--define.<key>=<value`, you can also define a variable with exporting environment variable `MDMOD_<key>`. `<key>` is down cased and appended to the constants array in VM.

## Official Plugins

### Table of Contents ([`mdmod-plugin-toc`](https://github.com/uetchy/mdmod-plugin-toc))

Generate a list of contents.

```bash
npm i -g mdmod-plugin-toc
mdmod README.md
```

```md
<!-- START mdmod {use: 'toc'} -->

- [mdmod](#mdmod)
  - [Features](#features)
  - [Install](#install)
  - [Use](#use)
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

<!-- END mdmod -->
```

### Table of Packages ([`mdmod-plugin-top`](https://github.com/uetchy/mdmod-plugin-top))

Generate a list of monorepo packages (`/packages/*`).

```bash
npm i -g mdmod-plugin-top
mdmod README.md
```

````md
 <!-- START mdmod {use: 'top'} -->

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

 <!-- END mdmod -->
````

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
