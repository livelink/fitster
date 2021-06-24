import Dimensions from './dimensions';

export default class Box {
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

  get scale() {
    const match = this._style.transform.match(/scale\((.+)\)/);
    return match ? match[1] : 1;
  }

  set scale(fraction) {
    this._style.transform = `scale(${fraction})`;
  }

  set width(value) {
    this._style.width = `${value}px`;
  }
  
  set height(value) {
    this._style.height = `${value}px`;
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
      position: 'fixed',
      transform: 'none',
      whiteSpace: 'nowrap',
      width: 'auto',
      height: 'auto'
    });
  }
  
  _enableWrapping() {
    Object.assign(this._style, {
      position: null,
      whiteSpace: 'break-spaces'
    });
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
