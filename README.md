# mdmod

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]

> In-place string replacement for Markdown

[npm-version]: https://badgen.net/npm/v/mdmod
[npm-downloads]: https://badgen.net/npm/dt/mdmod
[npm-url]: https://npmjs.org/package/mdmod

## Table of Contents

<!-- START mdmod {use: 'toc'} -->

- [mdmod](#mdmod)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Install](#install)
  - [Use](#use)
    - [Replace strings](#replace-strings)
    - [Table of contents](#table-of-contents)
  - [Advanced Usage](#advanced-usage)
    - [Update version string in README.md](#update-version-string-in-readmemd)

<!-- END mdmod -->

## Features

- Replace strings
- Create Table of Contents ([mdmod-plugin-toc](https://github.com/uetchy/mdmod-plugin-toc)).

## Install

```bash
npm i -g mdmod
# or `npm i mdmod` to install mdmod locally
```

## Use

### Replace strings

```bash
mdmod README.md --define.version v6.0.0
```

```md
<!-- START mdmod {replace: version} -->

v0.2.0

<!-- END mdmod -->
```

```md
<!-- START mdmod [
  {match: /v\d\.\d\.\d/g, replace: () => version}
] -->

curl https://path/to/releases/v0.2.0.tar.gz
tar -zxvf v0.2.0.tar.gz

<!-- END mdmod -->
```

### Table of contents

```bash
npm i -g mdmod-plugin-toc
mdmod README.md
```

```md
<!-- START mdmod {use: 'toc'} -->

- [mdmod](#mdmod)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Install](#install)
  - [Use](#use)
    - [Replace strings](#replace-strings)
    - [Table of contents](#table-of-contents)
  - [Advanced Usage](#advanced-usage)
    - [Update version string in README.md](#update-version-string-in-readmemd)

<!-- END mdmod -->

<!-- START mdmod {use: 'mdmod-plugin-toc'} -->

- [mdmod](#mdmod)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Install](#install)
  - [Use](#use)
    - [Replace strings](#replace-strings)
    - [Table of contents](#table-of-contents)
  - [Advanced Usage](#advanced-usage)
    - [Update version string in README.md](#update-version-string-in-readmemd)

<!-- END mdmod -->
```

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
curl -LO https://github.com/uetchy/mdmod/archive/v0.2.0.zip
unzip v0.2.0.zip
```

<!-- END mdmod -->
````
