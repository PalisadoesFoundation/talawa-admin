export class PostsPage {
  private readonly _postsTabButton = '[data-cy="leftDrawerButton-Posts"]';
  private readonly _createPostButton = '[data-cy="createPostModalBtn"]';
  private readonly _postTitleInput = '[data-cy="modalTitle"]';
  private readonly _postDescriptionInput =
    '[data-cy="create-post-description"]';
  private readonly _pinPostCheckbox = '[data-cy="pinPost"]';
  private readonly _moreOptionsIcon =
    '[data-testid="post-more-options-button"]';
  private readonly _editOption = '[data-testid="edit-post-menu-item"]';
  private readonly _createPostSubmit = '[data-testid="createPostBtn"]';
  private readonly _deleteOption = '[data-testid="delete-post-button"]';
  private readonly _sortButton = '[data-testid="sortpost-toggle"]';

  visitPostsPage() {
    cy.get(this._postsTabButton).should('be.visible').click();
    cy.url().should('match', /\/orgpost\/[a-f0-9-]+/);
    return this;
  }

  createPost(title: string, description: string) {
    cy.get(this._createPostButton).should('be.visible').click();
    cy.get(this._postTitleInput).filter(':visible').type(title);
    cy.get(this._postDescriptionInput).filter(':visible').type(description);
    cy.get(this._pinPostCheckbox).filter(':visible').click();
    cy.get(this._createPostSubmit)
      .filter(':visible')
      .should('be.visible')
      .click();
    cy.assertToast('Congratulations! You have Posted Something.');
    return this;
  }

  sortPostsByNewest() {
    cy.get(this._sortButton).should('be.visible').click();
    cy.get('[data-testid="sortpost-item-latest"]').should('be.visible').click();
    return this;
  }

  editFirstPost(newTitle: string) {
    this.sortPostsByNewest();
    cy.get(this._moreOptionsIcon).first().should('be.visible').click();
    cy.get(this._editOption).should('be.visible').click();
    cy.get(this._postTitleInput).filter(':visible').clear().type(newTitle);
    cy.get(this._createPostSubmit).filter(':visible').click({ force: true });
    cy.assertToast('Post updated successfully');
    return this;
  }

  deleteFirstPost() {
    cy.get(this._moreOptionsIcon).first().should('be.visible').click();
    cy.get(this._deleteOption).should('be.visible').click();
    cy.assertToast('Post deleted successfully.');
    return this;
  }
}
