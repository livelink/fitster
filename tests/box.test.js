import textWrapElement from './helpers/text-wrap-element.js';

import { Box } from '../index';

describe('Box', () => {
  test('can get a friendly string for debugging', () => {
    const box = new Box({ clientWidth: 400, clientHeight: 300 });

    expect(box.toString()).toEqual('[box 400x300]');
  });

  describe('fitting', () => {
    test('can know if frame fits within dimensions', () => {
      const box = new Box({
        clientWidth: 400,
        clientHeight: 300,
        scrollWidth: 400,
        scrollHeight: 300,
      });

      expect(box.fits(400, 300)).toEqual(true);
    });

    test('can know if frame width exceeds dimensions', () => {
      const box = new Box({
        clientWidth: 410,
        clientHeight: 300,
        scrollWidth: 400,
        scrollHeight: 300,
      });

      expect(box.fits(400, 300)).toEqual(false);
    });

    test('can know if frame height exceeds dimensions', () => {
      const box = new Box({
        clientWidth: 400,
        clientHeight: 310,
        scrollWidth: 400,
        scrollHeight: 300,
      });

      expect(box.fits(400, 300)).toEqual(false);
    });

    test('can know if content width exceeds dimensions', () => {
      const box = new Box({
        clientWidth: 400,
        clientHeight: 300,
        scrollWidth: 410,
        scrollHeight: 300,
      });

      expect(box.fits(400, 300)).toEqual(false);
    });

    test('can know if content height exceeds dimensions', () => {
      const box = new Box({
        clientWidth: 400,
        clientHeight: 300,
        scrollWidth: 400,
        scrollHeight: 310,
      });

      expect(box.fits(400, 300)).toEqual(false);
    });
  });

  describe('wrapping', () => {
    test('can enable wrapping', () => {
      const element = { style: {} };
      const box = new Box(element);

      box.wrap = true;

      expect(element.style).toEqual({
        position: null,
        whiteSpace: 'break-spaces'
      });
    });

    test('can disable wrapping', () => {
      const element = { style: {} };
      const box = new Box(element);

      box.wrap = false;

      expect(element.style).toEqual({
        position: 'fixed',
        transform: 'none',
        whiteSpace: 'nowrap',
        width: 'auto',
        height: 'auto'
      });
    });
  });

  describe('scaling', () => {
    test('can set scale', () => {
      const element = { style: {} };
      const box = new Box(element);

      box.scale = 0.75;

      expect(element.style).toEqual({ transform: 'scale(0.75)' });
    });
  });

  describe('overflowing', () => {
    test('can know if content overflowing frame width', () => {
      const box = new Box({ clientWidth: 400, scrollWidth: 410 });

      expect(box.widthHasOverflow).toEqual(true);
    });

    test('can know if content not overflowing frame width', () => {
      const box = new Box({ clientWidth: 400, scrollWidth: 390 });

      expect(box.widthHasOverflow).toEqual(false);
    });

    test('can fix rounding bug on content in safari', () => {
      const fits = new Box({ clientWidth: 400, scrollWidth: 401 });
      const overflows = new Box({ clientWidth: 400, scrollWidth: 402 });

      expect(fits.widthHasOverflow).toEqual(false);
      expect(overflows.widthHasOverflow).toEqual(true);
    });
  });

  describe('dimensions', () => {
    test('can set width', () => {
      const element = { style: {} };
      const box = new Box(element);

      box.width = 100;

      expect(element.style).toEqual({ width: '100px' });
    });
    
    test('can set height', () => {
      const element = { style: {} };
      const box = new Box(element);

      box.height = 100;

      expect(element.style).toEqual({ height: '100px' });
    });

    describe('frame', () => {
      test('can get frame width', () => {
        const box = new Box({ clientWidth: 400, scrollWidth: 410 });

        expect(box.frame.width).toEqual(400);
      });

      test('can get frame height', () => {
        const box = new Box({ clientHeight: 300, scrollHeight: 310 });

        expect(box.frame.height).toEqual(300);
      });
      
      test('can get aspect', () => {
        const box = new Box({
          clientWidth: 400,
          scrollWidth: 410,
          clientHeight: 300,
          scrollHeight: 310,
        });

        expect(box.frame.aspect.toFixed(4)).toEqual('1.3333');
      });
    });

    describe('content', () => {
      test('can get content width', () => {
        const box = new Box({ clientWidth: 400, scrollWidth: 411 });

        expect(box.content.width).toEqual(410);
      });

      test('can get content height', () => {
        const box = new Box({ clientHeight: 300, scrollHeight: 310 });

        expect(box.content.height).toEqual(310);
      });
      
      test('can get aspect', () => {
        const box = new Box({
          clientWidth: 390,
          scrollWidth: 401,
          clientHeight: 290,
          scrollHeight: 300,
        });

        expect(box.content.aspect.toFixed(4)).toEqual('1.3333');
      });
    });
    
    describe('outer', () => {
      test('can get width when content is not overflowing', () => {
        const box = new Box({ clientWidth: 400, scrollWidth: 390 });

        expect(box.outer.width).toEqual(400);
      });

      test('can get width when content is overflowing', () => {
        const box = new Box({ clientWidth: 400, scrollWidth: 411 });

        expect(box.outer.width).toEqual(410);
      });
      
      test('can get height when content is not overflowing', () => {
        const box = new Box({ clientHeight: 300, scrollHeight: 290 });

        expect(box.outer.height).toEqual(300);
      });

      test('can get height when content is overflowing', () => {
        const box = new Box({ clientHeight: 300, scrollHeight: 310 });

        expect(box.outer.height).toEqual(310);
      });
      
      test('can get aspect when overflowing', () => {
        const box = new Box({
          clientWidth: 400,
          scrollWidth: 411,
          clientHeight: 300,
          scrollHeight: 310,
        });

        expect(box.outer.aspect.toFixed(4)).toEqual('1.3226');
      });

      test('can get aspect when not overflowing', () => {
        const box = new Box({
          clientWidth: 400,
          scrollWidth: 390,
          clientHeight: 300,
          scrollHeight: 290,
        });

        expect(box.outer.aspect.toFixed(4)).toEqual('1.3333');
      });
    });
  });
});