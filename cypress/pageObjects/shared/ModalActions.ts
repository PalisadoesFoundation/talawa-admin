import type { ClickOptions } from './types';

export class ModalActions {
  constructor(private readonly rootSelector = '[role="dialog"]') {}

  private root(timeout = 10000): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.rootSelector, { timeout });
  }

  waitVisible(timeout = 10000): this {
    this.root(timeout).should('be.visible');
    return this;
  }

  clickByTestId(testId: string, options?: ClickOptions, timeout = 10000): this {
    this.root(timeout)
      .find(`[data-testid="${testId}"]`)
      .should('be.visible')
      .click(options);
    return this;
  }

  clickBySelector(
    selector: string,
    options?: ClickOptions,
    timeout = 10000,
  ): this {
    this.root(timeout).find(selector).should('be.visible').click(options);
    return this;
  }

  submit(testId = 'modal-submit-btn', options?: ClickOptions): this {
    return this.clickByTestId(testId, options);
  }

  cancel(testId = 'modal-cancel-btn', options?: ClickOptions): this {
    return this.clickByTestId(testId, options);
  }

  close(testId = 'modalCloseBtn', options?: ClickOptions): this {
    return this.clickByTestId(testId, options);
  }

  hasTitle(title: string, timeout = 10000): this {
    this.root(timeout)
      .find('h1,h2,h3,[class*="Title"],[role="heading"]')
      .should('contain.text', title)
      .and('be.visible');
    return this;
  }
}
