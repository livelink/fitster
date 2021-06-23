import Box from './box';
import NaturalWidthGrower from './defaults/natural-width-grower';
import AspectMatchingWrapper from './defaults/aspect-matching-wrapper';
import FitToScaler from './defaults/fit-to-scaler';

export default class Fitster {
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