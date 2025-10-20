import { AdminDashboardPage } from '../../pageObjects/AdminPortal/AdminDashboard';
import { PostsPage } from '../../pageObjects/AdminPortal/PostPage';

describe('Testing Posts Management in Admin Portal', () => {
  const dashboard = new AdminDashboardPage();
  const postsPage = new PostsPage();

  beforeEach(() => {
    cy.loginByApi('admin');
    dashboard.visit().verifyOnDashboard().openFirstOrganization();
    postsPage.visitPostsPage();
  });

  it('should create a new post', () => {
    postsPage.createPost(
      'Test Post Title',
      'This is a test post description.',
      'cypress/fixtures/advertisement_banner.png',
    );
  });

  it('should edit the created post', () => {
    postsPage.editFirstPost(
      'Updated Test Post Title',
      'cypress/fixtures/advertisement_banner.png',
    );
  });

  it('should delete the edited post', () => {
    postsPage.deleteFirstPost();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
