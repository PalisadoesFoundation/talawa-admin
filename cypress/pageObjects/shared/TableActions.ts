import type { ClickOptions } from './types';

export class TableActions {
  constructor(private readonly tableSelector = '.MuiDataGrid-root') {}

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private root(timeout = 10000): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(this.tableSelector, { timeout });
  }

  waitVisible(timeout = 10000): this {
    this.root(timeout).should('be.visible');
    return this;
  }

  findRowByText(
    text: string,
    timeout = 10000,
    exact = true,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    const matcher = exact ? new RegExp(`^${this.escapeRegex(text)}$`) : text;

    return cy
      .get(`${this.tableSelector} .MuiDataGrid-row`, { timeout })
      .contains(matcher)
      .should('be.visible')
      .closest('.MuiDataGrid-row');
  }

  clickRowActionByText(
    rowText: string,
    actionSelector: string,
    timeout = 10000,
    options?: ClickOptions,
    exact = true,
  ): this {
    this.findRowByText(rowText, timeout, exact)
      .find(actionSelector)
      .should('be.visible')
      .click(options);
    return this;
  }

  // Intentionally global queries: sorting menus can render outside `tableSelector`.
  sortBy(
    toggleSelector: string,
    optionSelector: string,
    timeout = 10000,
  ): this {
    cy.get(toggleSelector, { timeout }).should('be.visible').click();
    cy.get(optionSelector, { timeout }).should('be.visible').click();
    return this;
  }

  filterBy(inputSelector: string, value: string, timeout = 10000): this {
    cy.get(inputSelector, { timeout }).should('be.visible').clear().type(value);
    return this;
  }

  expectMinRows(minRows: number, timeout = 10000): this {
    cy.get(`${this.tableSelector} .MuiDataGrid-row`, { timeout }).should(
      'have.length.at.least',
      minRows,
    );
    return this;
  }

  cell(
    rowIndex: number,
    columnIndex: number,
    timeout = 10000,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .get(`${this.tableSelector} .MuiDataGrid-row`, { timeout })
      .eq(rowIndex)
      .find('[role="gridcell"], td')
      .eq(columnIndex);
  }
}
