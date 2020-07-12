import { newE2EPage } from '@stencil/core/testing';

describe('genius-center-button', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<genius-center-button></genius-center-button>');

    const element = await page.find('genius-center-button');
    expect(element).toHaveClass('hydrated');
  });
});
