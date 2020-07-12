import { newSpecPage } from '@stencil/core/testing';
import { GeniusGame } from '../genius-game';

describe('genius-game', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GeniusGame],
      html: `<genius-game></genius-game>`,
    });
    expect(page.root).toEqualHtml(`
      <genius-game>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </genius-game>
    `);
  });
});
