import { newE2EPage } from '@stencil/core/testing';

describe('genius-game', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genius-game></genius-game>');

    const element = await page.find('genius-game');
    expect(element).toHaveClass('hydrated');
  });
});
