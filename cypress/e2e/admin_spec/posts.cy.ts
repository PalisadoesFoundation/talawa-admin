// SKIP_LOCALSTORAGE_CHECK
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
    postsPage.createPost('Test Post Title', 'This is a test post description.');
  });

  it('should edit the created post', () => {
    postsPage.editFirstPost('Updated Test Post Title');
  });

  it('should delete the edited post', () => {
    postsPage.deleteFirstPost();
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });
});
