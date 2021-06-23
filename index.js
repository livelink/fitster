import Box from './src/box';
import NaturalWidthGrower from './src/defaults/natural-width-grower';
import AspectMatchingWrapper from './src/defaults/aspect-matching-wrapper';
import FitToScaler from './src/defaults/fit-to-scaler';

class Fitster {
  constructor(
    element,
    {
      grower = NaturalWidthGrower,
      wrapper = AspectMatchingWrapper,
      scaler = FitToScaler,
    } = {}
  ) {
    const box = new Box(element);

    this._box = box;
    this._grower = new grower(box);
    this._wrapper = new wrapper(box);
    this._scaler = new scaler(box);
  }

  fitTo(width, height) {
    this._grower.grow(width, height);
    this._wrapper.wrap(width, height);
    this._scaler.scale(width, height);
  }

  get scale() {
    return this._box.scale;
  }
}

export {
  Fitster as default,
  Box,
  NaturalWidthGrower,
  AspectMatchingWrapper,
  FitToScaler
};
