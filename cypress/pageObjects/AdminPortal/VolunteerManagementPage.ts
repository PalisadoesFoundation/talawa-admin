import { BasePage } from '../base/BasePage';

export class VolunteerManagementPage extends BasePage<VolunteerManagementPage> {
  private readonly volunteersTabButton = 'volunteersBtn';
  private readonly volunteersTabPanel = 'eventVolunteersTab';
  private readonly individualToggle = 'individualRadio';
  private readonly groupsToggle = 'groupsRadio';
  private readonly requestsToggle = 'requestsRadio';
  private readonly addVolunteerButton = 'addVolunteerBtn';
  private readonly createGroupButton = 'createGroupBtn';

  protected self(): VolunteerManagementPage {
    return this;
  }

  visitPage(orgId: string, eventId: string, timeout = 30000): this {
    this.visit(`/admin/event/${orgId}/${eventId}`);
    this.assertUrlIncludes(`/admin/event/${orgId}/${eventId}`, timeout);
    return this;
  }

  openVolunteersTab(timeout = 10000): this {
    this.byTestId(this.volunteersTabButton, timeout)
      .should('be.visible')
      .click();
    this.byTestId(this.volunteersTabPanel, timeout).should('be.visible');
    return this;
  }

  showIndividuals(timeout = 10000): this {
    this.byTestId(this.individualToggle, timeout).should('be.visible').click();
    return this;
  }

  showGroups(timeout = 10000): this {
    this.byTestId(this.groupsToggle, timeout).should('be.visible').click();
    return this;
  }

  showRequests(timeout = 10000): this {
    this.byTestId(this.requestsToggle, timeout).should('be.visible').click();
    return this;
  }

  openAddVolunteerModal(timeout = 10000): this {
    this.byTestId(this.addVolunteerButton, timeout)
      .should('be.visible')
      .click();
    this.modalActions().waitVisible(timeout);
    return this;
  }

  openCreateGroupModal(timeout = 10000): this {
    this.byTestId(this.createGroupButton, timeout).should('be.visible').click();
    this.modalActions().waitVisible(timeout);
    return this;
  }
}
