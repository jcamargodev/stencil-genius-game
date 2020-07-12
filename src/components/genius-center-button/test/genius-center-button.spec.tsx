import { newSpecPage } from '@stencil/core/testing';
import { GeniusCenterButton } from '../genius-center-button';

describe('genius-center-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GeniusCenterButton],
      html: `<genius-center-button></genius-center-button>`,
    });
    expect(page.root).toEqualHtml(`
      <genius-center-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </genius-center-button>
    `);
  });
});
