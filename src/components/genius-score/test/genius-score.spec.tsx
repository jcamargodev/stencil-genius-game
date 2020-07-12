import { newSpecPage } from '@stencil/core/testing';
import { GeniusScore } from '../genius-score';

describe('genius-score', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GeniusScore],
      html: `<genius-score></genius-score>`,
    });
    expect(page.root).toEqualHtml(`
      <genius-score>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </genius-score>
    `);
  });
});
