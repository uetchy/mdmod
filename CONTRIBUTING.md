# Contribution Guide

## Development Guide

### Core

```bash
git clone https://github.com/uetchy/mdmod.git && cd mdmod
yarn install
yarn husky install
yarn build
```

### Plugin

#### Example: DoNothing Plugin

```js
module.exports = function plugin({
  document, // string: whole document
  fragment, // string: fragment text between SOB and EOB
  constants, // {[string]: string}: constants passed from `--define` or envvar
  cwd, // string: working directory (same directory as given Markdown file)
  args, // {[string]: string}: plugin arguments
}) {
  return fragment;
};
```

## Release Guide (Maintainers only)

```bash
np
```
