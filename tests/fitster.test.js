import textWrapElement from './helpers/text-wrap-element.js';

import Fitster from '../index';

describe('Fitster', () => {
  test('can fit element to width and height', () => {
    const actions = [];

    const fitster = new Fitster(
      { clientWidth: 800, clientHeight: 600 },
      {
        grower: class {
          constructor(box) {
            this._box = box;
          }

          grow(width, height) {
            actions.push(`grew ${this._box} for ${width}x${height}`);
          }
        },
        wrapper: class {
          constructor(box) {
            this._box = box;
          }

          wrap(width, height) {
            actions.push(`wrapped ${this._box} for ${width}x${height}`);
          }
        },
        scaler: class {
          constructor(box) {
            this._box = box;
          }

          scale(width, height) {
            actions.push(`scaled ${this._box} for ${width}x${height}`);
          }
        },
      }
    );

    fitster.fitTo(400, 300);

    expect(actions).toEqual([
      'grew [box 800x600] for 400x300',
      'wrapped [box 800x600] for 400x300',
      'scaled [box 800x600] for 400x300',
    ]);
  });

  test('can scale down until text wrap causes box to match aspect', () => {
    const element = textWrapElement(800, 400);
    const style = element.style;
    const fitster = new Fitster(element);

    fitster.fitTo(300, 900);

    expect(style.width).toEqual('327px');
    expect(style.transform).toEqual('scale(0.91743)');
    expect(style.whiteSpace).toEqual('break-spaces');
  });

  test('can scale down until text starts to overflow', () => {
    const element = textWrapElement(800, 400, { overflowWidth: 600 });
    const style = element.style;
    const fitster = new Fitster(element);

    fitster.fitTo(300, 900);

    expect(style.width).toEqual('599px');
    expect(style.transform).toEqual('scale(0.50083)');
    expect(style.whiteSpace).toEqual('break-spaces');
  });
});
