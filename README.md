<h1 align="center">mdmod</h1>
<p align="center">mdmod</p>

[![npm-version]][npm-url]
[![npm-downloads]][npm-url]

[npm-version]: https://badgen.net/npm/v/mdmod
[npm-downloads]: https://badgen.net/npm/dt/mdmod
[npm-url]: https://npmjs.org/package/mdmod

## Install

```bash
yarn add mdmod
# or npm i mdmod
```

## Use

### Replace string

```bash
mdmod README.md --args.newVersion v6.0.0
```

```
<!-- START mdmod {replace: () => newVersion} -->
v5.0.2
<!-- END mdmod -->
```

```
<!-- START mdmod [
  {match: /https?/,      replace: () => useHttps ? 'https': 'http'},
  {match: /v\d\.\d\.\d/, replace: () => newVersion}
] -->

curl https://path/to/releases/v5.0.2.tar.gz
tar -zxvf v5.0.2.tar.gz

<!-- END mdmod -->
```

### Table of contents

```bash
npm i -g mdmod mdmod-plugin-toc
mdmod README.md
```

```
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
