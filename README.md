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

### Sync version

```bash
mdmod README.md -e version v6.0.0
```

<!-- START mdmod {replace: () => version} -->

version string here

<!-- END mdmod -->

<!-- START mdmod [
  {match: /wooops/,      replace: () => 'curl'},
  {match: /v\d\.\d\.\d/, replace: () => version}
] -->

```
wooops v0.0.0
```

<!-- END mdmod -->

<!-- START mdmod ({use: 'top'}) -->

v2.0.0

<!-- END mdmod -->
