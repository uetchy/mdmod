# Contribution Guide

## Development Guide

### Core

```bash
git clone https://github.com/uetchy/mdmod.git && cd mdmod
yarn install
yarn build
```

### Plugin

#### Example: DoNothing Plugin

```js
module.exports = function plugin({
  document, // whole document
  fragment, // fragment text between SOB and EOB
  constants, // constants passed from `--define` or envvar
  cwd, // working directory (same directory as given Markdown file)
}) {
  return fragment;
};
```

## Release Guide (Maintainers only)

```bash
np
```
