import { newE2EPage } from '@stencil/core/testing';

describe('genius-score', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genius-score></genius-score>');

    const element = await page.find('genius-score');
    expect(element).toHaveClass('hydrated');
  });
});
