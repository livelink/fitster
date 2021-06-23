export default class FitToScaler {
  constructor(box) {
    this._box = box;
  }

  scale(width, height) {
    if (this._box.fits(width, height)) return;

    const min = Math.min(
      width / this._box.frame.width,
      height / this._box.frame.height
    );

    this._box.scale = parseFloat(min.toFixed(5));;
  }
}
