import { newE2EPage } from '@stencil/core/testing';

describe('genius-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genius-button></genius-button>');

    const element = await page.find('genius-button');
    expect(element).toHaveClass('hydrated');
  });
});
