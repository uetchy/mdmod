<h1 align="center">mdmod</h1>
<p align="center">Universal Markdown replacement</p>

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]

[npm-version]: https://badgen.net/npm/v/mdmod
[npm-downloads]: https://badgen.net/npm/dt/mdmod
[npm-url]: https://npmjs.org/package/mdmod

## Features

- Replace strings
- Create Table of Contents ([mdmod-plugin-toc](https://github.com/mdmod-plugin-toc)).

## Install

```bash
npm i -g mdmod
# or `npm i mdmod` to install mdmod locally
```

## Use

### Replace strings

```bash
mdmod README.md --args.version v6.0.0
```

```md
<!-- START mdmod {replace: () => version} -->

v5.0.2

<!-- END mdmod -->
```

```md
<!-- START mdmod [
  {match: /v\d\.\d\.\d/, replace: () => version}
] -->

curl https://path/to/releases/v5.0.2.tar.gz
tar -zxvf v5.0.2.tar.gz

<!-- END mdmod -->
```

### Table of contents

```bash
npm i -g mdmod-plugin-toc
mdmod README.md
```

```md
<!-- START mdmod ({use: 'toc'}) -->

- [mdmod](#mdmod)
  - [Install](#install)
  - [Use](#use)
    - [Replace string](#replace-string)
    - [Table of contents](#table-of-contents)

<!-- END mdmod -->

<!-- START mdmod ({use: 'mdmod-plugin-toc'}) -->

- [mdmod](#mdmod)
  - [Install](#install)
  - [Use](#use)
    - [Replace string](#replace-string)
    - [Table of contents](#table-of-contents)

<!-- END mdmod -->
```
