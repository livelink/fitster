import textWrapElement from '../helpers/text-wrap-element.js';

import { Box, NaturalWidthGrower } from '../../index';

describe('NaturalWidthGrower', () => {
  test('can grow box to natural width if there were no wrap', () => {
    const box = {
      wrap: true,
      get frame() {
        return this.wrap ? { width: 400 } : { width: 600 };
      },
    };

    new NaturalWidthGrower(box).grow(100, 0);

    expect(box.width).toEqual(600);
  });

  test('can grow box to min width when larger than natural width', () => {
    const box = {
      wrap: true,
      get frame() {
        return this.wrap ? { width: 400 } : { width: 600 };
      },
    };

    new NaturalWidthGrower(box).grow(800, 0);

    expect(box.width).toEqual(800);
  });

  test('can restore wrapping after getting natural width', () => {
    const box = {
      wrap: true,
      get frame() {
        return this.wrap ? { width: 400 } : { width: 600 };
      },
    };

    new NaturalWidthGrower(box).grow(100, 0);

    expect(box.wrap).toEqual(true);
  });
});
