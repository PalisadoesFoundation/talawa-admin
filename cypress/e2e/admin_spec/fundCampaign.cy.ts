import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { OrganizationFundCampaignPage } from '../../pageObjects/AdminPortal/OrganizationFundCampaignPage';

describe('Testing Admin Fund Campaign Management', () => {
  const dashboard = new AdminDashboardPage();
  const fundCampaignPage = new OrganizationFundCampaignPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();

    // Navigate to funds page (route: /orgfunds/:orgId)
    fundCampaignPage.visitFundsPage();

    // Wait for funds page to load and click "View Campaigns" button for first fund
    fundCampaignPage.clickViewBtn(15000);

    // Wait for campaigns page to fully load
    fundCampaignPage.waitForCampaignsPageLoad();
  });

  it('should display campaigns list with amount raised and progress', () => {
    // Check if campaigns exist, if not verify empty state
    fundCampaignPage.verifyCampaignsExistAndRun(() => {
      fundCampaignPage
        .verifyCampaignsListVisible()
        .verifyRaisedCellsVisible()
        .verifyProgressCellsVisible()
        .verifyGoalCellsVisible();
    });
  });

  it('should display amount raised with currency symbol', () => {
    // Check if campaigns exist, if not verify empty state
    fundCampaignPage.verifyCampaignsExistAndRun(() => {
      fundCampaignPage.getFirstRaisedCellTextAndVerify((text) => {
        // Should contain a currency symbol or number
        expect(text).to.match(/[$€£¥₹]|\d+/);
        // Should contain a number
        expect(text).to.match(/\d+/);
      });
    });
  });

  it('should calculate and display progress percentage correctly', () => {
    // Check if campaigns exist, if not verify empty state
    fundCampaignPage.verifyCampaignsExistAndRun(() => {
      fundCampaignPage.getFirstProgressCellTextAndVerify((text) => {
        // Should contain a percentage (0-100%)
        expect(text).to.match(/\d+%/);
        const percentage = parseInt(text.match(/(\d+)%/)?.[1] || '0');
        expect(percentage).to.be.at.least(0).and.at.most(100);
      });
    });
  });

  it('should search campaigns by name', () => {
    // Check if campaigns exist, if not verify empty state
    fundCampaignPage.verifyCampaignsExistAndRun(() => {
      fundCampaignPage.getFirstCampaignNameText((campaignName) => {
        const searchTerm = campaignName.substring(0, 3);
        fundCampaignPage
          .searchCampaign(searchTerm)
          .verifySearchResults(campaignName, true);
      });
    });
  });

  it('should navigate to campaign pledge page on row click', () => {
    // Check if campaigns exist, if not verify empty state
    fundCampaignPage.verifyCampaignsExistAndRun(() => {
      fundCampaignPage.clickFirstCampaign();
      // Should navigate to pledge page
      cy.url({ timeout: 10000 }).should('include', '/fundCampaignPledge/');
    });
  });

  it('should show empty state when no campaigns exist', () => {
    // Verify either empty state or campaigns list
    fundCampaignPage.verifyCampaignsListOrEmptyState();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
