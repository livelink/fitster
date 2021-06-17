class Dimensions {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }
  
  get width() {
    return this._width;
  }
  
  get height() {
    return this._height;
  }
  
  get aspect() {
    return this.width / this.height;
  }
  
  fits(dimensions) {
    return this.width <= dimensions.width && this.height <= dimensions.height;
  }
}

export class Box {
  constructor(element, { safariSizeFix = 1 } = {}) {
    this._element = element;
    this._safariSizeFix = safariSizeFix;
  }
  
  fits(width, height) {
    return this.outer.fits(new Dimensions(width, height));
  }
  
  get frame() {
    const element = this._element;
    
    return new Dimensions(element.clientWidth, element.clientHeight);
  }

  get content() {
    const element = this._element;
    
    return new Dimensions(
      element.scrollWidth - this._safariSizeFix,
      element.scrollHeight
    );
  }

  get outer() {
    const content = this.content;
    const frame = this.frame;
    
    return new Dimensions(
      Math.max(content.width, frame.width),
      Math.max(content.height, frame.height)
    );
  }

  get widthHasOverflow() {
    return this.content.width > this.frame.width;
  }
  
  set wrap(boolean) {
    boolean ? this._enableWrapping() : this._disableWrapping();
  }

  set scale(fraction) {
    this._style.transform = `scale(${fraction})`;
  }

  set width(value) {
    this._style.width = `${value}px`;
  }

  toString() {
    const frame = this.frame;
    
    return `[box ${frame.width}x${frame.height}]`;
  }

  get _style() {
    return this._element.style;
  }

  _disableWrapping() {
    Object.assign(this._style, {
      transform: 'none',
      whiteSpace: 'nowrap',
      width: 'auto',
    });
  }

  _enableWrapping() {
    this._style.whiteSpace = 'break-spaces';
  }
}

export class NaturalWidthGrower {
  constructor(box) {
    this._box = box;
  }

  grow(minWidth, minHeight) {
    this._box.wrap = false;
    this._box.width = Math.max(this._box.frame.width, minWidth);
    this._box.wrap = true;
  }
}

export class AspectMatchingWrapper {
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

    if (this._box.fits(width, height)) this._box.width = width;
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

export class FitToScaler {
  constructor(box) {
    this._box = box;
  }

  scale(width, height) {
    if (this._box.fits(width, height)) return;

    const min = Math.min(
      width / this._box.frame.width,
      height / this._box.frame.height
    );

    this._box.scale = parseFloat(min.toFixed(5));
  }
}

export default class FitText {
  constructor(
    element,
    {
      grower = NaturalWidthGrower,
      wrapper = AspectMatchingWrapper,
      scaler = FitToScaler,
    } = {}
  ) {
    const box = new Box(element);

    this._grower = new grower(box);
    this._wrapper = new wrapper(box);
    this._scaler = new scaler(box);
  }

  fitTo(width, height) {
    this._grower.grow(width, height);
    this._wrapper.wrap(width, height);
    this._scaler.scale(width, height);
  }
}
