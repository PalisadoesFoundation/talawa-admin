import { ModalActions } from '../shared/ModalActions';
import { TableActions } from '../shared/TableActions';

export abstract class BasePage<TSelf extends BasePage<TSelf>> {
  protected abstract self(): TSelf;

  protected byTestId(
    testId: string,
    timeout = 10000,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-testid="${testId}"]`, { timeout });
  }

  protected byDataCy(
    value: string,
    timeout = 10000,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-cy="${value}"]`, { timeout });
  }

  protected tableActions(tableSelector = '.MuiDataGrid-root'): TableActions {
    return new TableActions(tableSelector);
  }

  protected modalActions(rootSelector = '[role="dialog"]'): ModalActions {
    return new ModalActions(rootSelector);
  }

  protected assertUrlIncludes(path: string, timeout = 10000): TSelf {
    cy.url({ timeout }).should('include', path);
    return this.self();
  }

  protected assertUrlMatch(pattern: RegExp, timeout = 10000): TSelf {
    cy.url({ timeout }).should('match', pattern);
    return this.self();
  }

  visit(path: string): TSelf {
    cy.visit(path);
    return this.self();
  }
}
