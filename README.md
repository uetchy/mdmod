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
  - [Plugins](#plugins)
    - [Table of Contents](#table-of-contents)
    - [Table of Packages](#table-of-packages)
  - [Advanced Usage](#advanced-usage)
    - [Update version string in README.md](#update-version-string-in-readmemd)

<!-- END mdmod -->

## Features

- In-place string replacement.
- [Plugins](#plugins) to extend feature.

## Install

```bash
npm i -g mdmod
# or `npm i mdmod` to install mdmod locally
```

## Use

```bash
mdmod README.md --define.version v6.0.0
```

```md
<!-- START mdmod {replace: version} -->

v0.4.0

<!-- END mdmod -->
```

```md
<!-- START mdmod [
  {match: /v\d\.\d\.\d/g, replace: () => version}
] -->

curl https://path/to/releases/v0.4.0.tar.gz
tar -zxvf v0.4.0.tar.gz

<!-- END mdmod -->
```

## Configuration

> Contribution wanted.

## Plugins

> Contribution wanted.

### Table of Contents

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
  - [Plugins](#plugins)
    - [Table of Contents](#table-of-contents)
    - [Table of Packages](#table-of-packages)
  - [Advanced Usage](#advanced-usage)
    - [Update version string in README.md](#update-version-string-in-readmemd)

<!-- END mdmod -->
```

### Table of Packages

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

## Advanced Usage

### Update version string in README.md

```bash
npx mdmod README.md --define.version $(git describe --tags --match 'v*' --abbrev=0)
```

README.md:

````md
# Download

<!-- START mdmod {match: /v\d\.\d\.\d/g, replace: version} -->

```bash
curl -LO https://github.com/uetchy/mdmod/archive/v0.4.0.zip
unzip v0.4.0.zip
```

<!-- END mdmod -->
````
