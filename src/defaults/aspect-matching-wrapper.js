export default class AspectMatchingWrapper {
  constructor(box, { rough = 100, precision = 1 } = {}) {
    this._box = box;
    this._rough = rough;
    this._precision = precision;
    box.wrap = true;
  }

  wrap(width, height) {
    const aspect = width / height;

    this._adjustWidthWhile({
      condition: () =>
        this._box.frame.width > width && this._box.outer.aspect > aspect,
      step: -this._rough,
    });

    this._adjustWidthWhile({
      condition: () => this._box.outer.aspect < aspect,
      step: this._precision,
    });
    
    const frameWidth = this._box.frame.width;

    this._box.width = frameWidth <= width ? width : frameWidth;
    this._box.height = frameWidth / aspect;
  }

  _adjustWidthWhile({ condition, step = 1 }) {
    while (condition()) {
      this._box.width = this._box.frame.width + step;
      if (!this._box.widthHasOverflow) continue;

      this._box.width = this._box.content.width;
      break;
    }
  }
}