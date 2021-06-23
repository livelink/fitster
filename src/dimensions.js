export default class Dimensions {
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
