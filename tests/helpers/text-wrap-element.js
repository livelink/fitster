export default function textWrapElement(
  startWidth,
  startHeight,
  { overflowWidth = 0 } = {}
) {
  const style = {
    get width() {
      return this._width;
    },

    set width(value) {
      const width = value === 'auto' ? startWidth : parseFloat(value);

      // Increase height as width shrinks, to simulate text wrap.
      const scale = startWidth / width;
      const height = startHeight * scale;

      element.clientWidth = width;
      element.scrollWidth = Math.max(width, overflowWidth);
      element.clientHeight = height;
      element.scrollHeight = height;

      this._width = value;
    },
  };

  const element = {
    clientWidth: startWidth,
    clientHeight: startHeight,
    scrollWidth: startWidth,
    scrollHeight: startHeight,
    style,
  };

  return element;
}