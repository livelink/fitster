# Fitster

Fits text proportionally to an element with intelligent text wrapping.

## Installation

```shell
yarn add fitster
```

## Usage

```javascript
import Fitster from '@livelink/fitster';

const fitster = new Fitster(document.querySelector('.my-element'));

fitster.fitTo(400, 300);

console.log(fitster.scale);
```

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/livelink/fitster. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](https://github.com/livelink/fitster/blob/main/CODE_OF_CONDUCT.md).

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Fitster project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](https://github.com/livelink/fitster/blob/main/CODE_OF_CONDUCT.md).
