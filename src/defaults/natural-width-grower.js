export default class NaturalWidthGrower {
  constructor(box) {
    this._box = box;
  }

  grow(minWidth, minHeight) {
    this._box.wrap = false;
    this._box.width = Math.max(this._box.frame.width, minWidth);
    this._box.wrap = true;
  }
}
