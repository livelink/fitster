import textWrapElement from '../helpers/text-wrap-element.js';

import { Box, FitToScaler } from '../../index';

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
