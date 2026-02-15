import { BasePage } from '../base/BasePage';

export class MemberManagementPage extends BasePage<MemberManagementPage> {
  private readonly peopleTabButton = 'leftDrawerButton-People';
  private readonly searchInput = '[placeholder="Enter Full Name"]';
  private readonly searchButton = 'searchbtn';
  private readonly addMembersButton = 'addMembers-toggle';
  private readonly existingUserToggle = 'addMembers-item-existingUser';
  private readonly searchUserInput = 'searchUser';
  private readonly submitSearchButton = 'submitBtn';
  private readonly addButton = 'addBtn';
  private readonly removeMemberActionSelector =
    '[data-testid="removeMemberModalBtn"]';
  private readonly confirmRemoveMemberButton = 'removeMemberBtn';
  private readonly alertSelector = '[role=alert]';
  private readonly table = this.tableActions('.MuiDataGrid-root');
  private readonly removeMemberModal = this.modalActions('[role="dialog"]');

  protected self(): MemberManagementPage {
    return this;
  }

  openFromDrawer(timeout = 40000): this {
    this.byDataCy(this.peopleTabButton, timeout).should('be.visible').click();
    this.assertUrlMatch(/\/admin\/orgpeople\/[a-f0-9-]+/, timeout);
    return this;
  }

  visitPage(orgId: string, timeout = 40000): this {
    this.visit(`/admin/orgpeople/${orgId}`);
    this.assertUrlIncludes(`/admin/orgpeople/${orgId}`, timeout);
    return this;
  }

  searchMemberByName(name: string, timeout = 40000): this {
    cy.get(this.searchInput, { timeout })
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  verifyMemberInList(name: string, timeout = 40000): this {
    this.table.findRowByText(name, timeout);
    return this;
  }

  clickAddExistingMember(timeout = 40000): this {
    this.byTestId(this.addMembersButton, timeout).should('be.visible').click();
    this.byTestId(this.existingUserToggle, timeout)
      .should('be.visible')
      .trigger('click');
    return this;
  }

  searchAndSelectUser(name: string, timeout = 40000): this {
    this.byTestId(this.searchUserInput, timeout)
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.submitSearchButton, timeout)
      .should('be.visible')
      .click();
    cy.contains(name, { timeout }).should('be.visible');
    return this;
  }

  confirmAddUser(name: string, timeout = 100000): this {
    this.byTestId(this.addButton, timeout).first().should('be.visible').click();
    cy.contains(this.alertSelector, 'Member added Successfully', {
      timeout,
    }).should('be.visible');
    cy.reload();
    this.searchMemberByName(name, timeout);
    this.verifyMemberInList(name, timeout);
    return this;
  }

  deleteMember(name: string, timeout = 40000): this {
    this.searchMemberByName(name, timeout);

    cy.then(() => {
      this.table.waitVisible(timeout);
      this.table.clickRowActionByText(
        name,
        this.removeMemberActionSelector,
        timeout,
      );
    });

    this.removeMemberModal
      .waitVisible(timeout)
      .clickByTestId(this.confirmRemoveMemberButton, { timeout });

    cy.get(this.alertSelector, { timeout })
      .should('be.visible')
      .and('contain.text', 'The Member is removed');

    return this;
  }

  resetSearch(timeout = 40000): this {
    cy.get(this.searchInput, { timeout }).should('be.visible').clear();
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  verifyMinRows(minRows: number, timeout = 40000): this {
    this.table.expectMinRows(minRows, timeout);
    return this;
  }
}
