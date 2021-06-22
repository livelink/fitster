import Fitster, {
  Box,
  NaturalWidthGrower,
  AspectMatchingWrapper,
  FitToScaler,
} from '../index';

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

describe('AspectMatchingWrapper', () => {
  test('can scale down until text wrap causes box to match aspect', () => {
    const element = textWrapElement(800, 400);

    new AspectMatchingWrapper(new Box(element)).wrap(300, 900);

    expect(element.style.width).toEqual('327px');
    expect(element.style.height).toEqual('981px');
  });

  test('can scale down until text starts to overflow', () => {
    const element = textWrapElement(800, 400, { overflowWidth: 600 });

    new AspectMatchingWrapper(new Box(element)).wrap(300, 900);

    expect(element.style.width).toEqual('599px');
    expect(element.style.height).toEqual('1797px');
  });
  
  test('can leave it alone if already fits without wrapping', () => {
    const element = textWrapElement(800, 400, { overflowWidth: 300 });

    new AspectMatchingWrapper(new Box(element)).wrap(400, 200);

    expect(element.style.width).toEqual('800px');
    expect(element.style.height).toEqual('400px');
  });
});

describe('FitToScaler', () => {
  test('can leave scale if box already fits', () => {
    const element = {
      clientWidth: 400,
      clientHeight: 300,
      scrollWidth: 400,
      scrollHeight: 300,
      style: {},
    };

    new FitToScaler(new Box(element)).scale(400, 300);

    expect(element.style).toEqual({});
  });

  test('can scale if width too big', () => {
    const element = {
      clientWidth: 450,
      clientHeight: 300,
      scrollWidth: 400,
      scrollHeight: 300,
      style: {},
    };

    new FitToScaler(new Box(element)).scale(400, 300);

    expect(element.style).toEqual({ transform: 'scale(0.88889)' });
  });

  test('can scale if height too big', () => {
    const element = {
      clientWidth: 400,
      clientHeight: 350,
      scrollWidth: 400,
      scrollHeight: 300,
      style: {},
    };

    new FitToScaler(new Box(element)).scale(400, 300);

    expect(element.style).toEqual({ transform: 'scale(0.85714)' });
  });

  test('can scale based on width if more significant than height', () => {
    const element = {
      clientWidth: 450,
      clientHeight: 301,
      scrollWidth: 400,
      scrollHeight: 300,
      style: {},
    };

    new FitToScaler(new Box(element)).scale(400, 300);

    expect(element.style).toEqual({ transform: 'scale(0.88889)' });
  });

  test('can scale based on height if more significant than width', () => {
    const element = {
      clientWidth: 401,
      clientHeight: 350,
      scrollWidth: 400,
      scrollHeight: 300,
      style: {},
    };

    new FitToScaler(new Box(element)).scale(400, 300);

    expect(element.style).toEqual({ transform: 'scale(0.85714)' });
  });
});

function textWrapElement(startWidth, startHeight, { overflowWidth = 0 } = {}) {
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
