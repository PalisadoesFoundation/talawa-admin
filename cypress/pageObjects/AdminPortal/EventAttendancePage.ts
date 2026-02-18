import { BasePage } from '../base/BasePage';

export type AttendanceSortOrder = 'ascending' | 'descending';
export type AttendanceFilterPeriod = 'This Month' | 'This Year' | 'All';

export class EventAttendancePage extends BasePage<EventAttendancePage> {
  private readonly attendanceTabButton = 'attendanceBtn';
  private readonly attendanceTabPanel = 'eventAttendanceTab';
  private readonly statsButton = 'stats-modal';
  private readonly closeStatisticsButton = 'close-button';
  private readonly searchInput = 'searchByName';
  private readonly searchButton = 'searchMembersBtn';
  private readonly sortToggleButton = 'sort-dropdown-toggle';
  private readonly sortItemPrefix = 'sort-dropdown-item-';
  private readonly filterToggleButton = 'filter-dropdown-toggle';
  private readonly filterMenu = '[data-testid="filter-dropdown-menu"]';
  private readonly table = this.tableActions('.MuiDataGrid-root');

  protected self(): EventAttendancePage {
    return this;
  }

  visitPage(orgId: string, eventId: string, timeout = 30000): this {
    this.visit(`/admin/event/${orgId}/${eventId}`);
    this.assertUrlIncludes(`/admin/event/${orgId}/${eventId}`, timeout);
    return this;
  }

  openAttendanceTab(timeout = 10000): this {
    this.byTestId(this.attendanceTabButton, timeout)
      .should('be.visible')
      .click();
    this.byTestId(this.attendanceTabPanel, timeout).should('be.visible');
    return this;
  }

  searchMemberByName(name: string, timeout = 10000): this {
    this.byTestId(this.searchInput, timeout)
      .should('be.visible')
      .clear()
      .type(name);
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  clearSearch(timeout = 10000): this {
    this.byTestId(this.searchInput, timeout).should('be.visible').clear();
    this.byTestId(this.searchButton, timeout).should('be.visible').click();
    return this;
  }

  setSortOrder(order: AttendanceSortOrder, timeout = 10000): this {
    this.byTestId(this.sortToggleButton, timeout).should('be.visible').click();
    this.byTestId(`${this.sortItemPrefix}${order}`, timeout)
      .should('be.visible')
      .click();
    return this;
  }

  setFilterPeriod(period: AttendanceFilterPeriod, timeout = 10000): this {
    this.byTestId(this.filterToggleButton, timeout)
      .should('be.visible')
      .click();

    cy.contains(`${this.filterMenu} [role="option"]`, period, {
      timeout,
    }).click();

    return this;
  }

  openStatisticsModal(timeout = 10000): this {
    this.byTestId(this.statsButton, timeout).should('be.visible').click();
    this.byTestId(this.closeStatisticsButton, timeout).should('be.visible');
    return this;
  }

  closeStatisticsModal(timeout = 10000): this {
    this.byTestId(this.closeStatisticsButton, timeout)
      .should('be.visible')
      .click();
    return this;
  }

  verifyAttendeeInList(name: string, timeout = 10000): this {
    this.table.findRowByText(name, timeout, false);
    return this;
  }
}
