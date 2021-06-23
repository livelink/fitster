# Fitster

Fits rich text proportionally to an element with intelligent text wrapping.

## Installation

```shell
yarn add fitster
```

## Usage

Fitster leverages JavaScript's native module system ([known as ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)), so can be used with your favourite front-end build tool.

```javascript
import Fitster from '@livelink/fitster';

const fitster = new Fitster(document.querySelector('.my-element'));

fitster.fitTo(400, 300);

console.log(fitster.scale);
```

### Before

![Before Fitster](https://github.com/livelink/fitster/blob/main/examples/before.png?raw=true)

### After

![Before Fitster](https://github.com/livelink/fitster/blob/main/examples/after.png?raw=true)

See [example on CodePen](https://codepen.io/thelucid/pen/ZEedvMq).

## Tests

To run the Jest test suite, just run:

```shell
yarn test
```

The test suite will automatically be run by GitHub actions on a push or pull request.

[![Quality](https://github.com/livelink/fitster/actions/workflows/quality.yml/badge.svg)](https://github.com/livelink/fitster/actions/workflows/quality.yml)

## Releases

Releases are automatically handled by GitHub Actions. Just set the correct semantic version number in `package.json`, commit and push changes, create a tag e.g. `v0.9.8`, push the new tag with `git push --tags`, and the rest will happen automatically.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/livelink/fitster. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/livelink/fitster/blob/main/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Fitster project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/livelink/fitster/blob/main/CODE_OF_CONDUCT.md).
