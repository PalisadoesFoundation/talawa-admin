// SKIP_LOCALSTORAGE_CHECK
import { PostsPage } from '../../pageObjects/AdminPortal/PostPage';

describe('Testing Posts Management in Admin Portal', () => {
  const postsPage = new PostsPage();
  let orgId = '';

  before(() => {
    cy.setupTestEnvironment({ auth: { role: 'admin' } }).then(
      ({ orgId: createdOrgId }) => {
        orgId = createdOrgId;
      },
    );
  });

  beforeEach(() => {
    cy.loginByApi('admin');
    cy.visit(`/admin/orgdash/${orgId}`);
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

  after(() => {
    if (orgId) {
      cy.cleanupTestOrganization(orgId);
    }
  });
});
