export type ClickOptions = Partial<Cypress.ClickOptions>;

export interface TestIdClickConfig {
  options?: ClickOptions;
  timeout?: number;
}
