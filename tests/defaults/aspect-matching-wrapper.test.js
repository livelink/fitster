import textWrapElement from '../helpers/text-wrap-element.js';

import { Box, AspectMatchingWrapper } from '../../index';

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
