export default class AspectMatchingWrapper {
  constructor(box) {
    this._box = box;
    box.wrap = true;
  }

  wrap(width, height) {
    const aspect = width / height;

    this._adjustWidthWhile({
      condition: () =>
        this._box.frame.width > width && this._box.outer.aspect > aspect,
      step: -width / 2,
    });

    this._adjustWidthWhile({
      condition: () => this._box.outer.aspect < aspect,
      step: 1,
    });

    const frameWidth = this._box.frame.width;

    this._box.width = frameWidth <= width ? width : frameWidth;
    this._box.height = frameWidth / aspect;
  }

  _adjustWidthWhile({ condition, step }) {
    while (condition()) {
      this._box.width = this._box.frame.width + step;

      if (!this._box.widthHasOverflow) continue;

      this._box.width = this._box.content.width;
      break;
    }
  }
}