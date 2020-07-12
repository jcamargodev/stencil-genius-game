import { newSpecPage } from '@stencil/core/testing';
import { GeniusButton } from '../genius-button';

describe('genius-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GeniusButton],
      html: `<genius-button></genius-button>`,
    });
    expect(page.root).toEqualHtml(`
      <genius-button>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </genius-button>
    `);
  });
});
