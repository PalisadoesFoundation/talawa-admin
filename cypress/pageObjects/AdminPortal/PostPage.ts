export class PostsPage {
  private readonly _postsTabButton = '[data-cy="leftDrawerButton-Posts"]';
  private readonly _createPostButton = '[data-cy="createPostModalBtn"]';
  private readonly _postTitleInput = '[data-cy="modalTitle"]';
  private readonly _postDescriptionInput = '[data-cy="modalinfo"]';
  private readonly _addMediaField = '[data-cy="addMediaField"]';
  private readonly _pinPostCheckbox = '[data-cy="pinPost"]';
  private readonly _createPostSubmit = '[data-cy="createPostBtn"]';
  private readonly _postCardContainer = '[data-cy="postCardContainer"]';
  private readonly _moreOptionsIcon = '[data-testid="more-options-button"]';
  private readonly _editOption = '[data-testid="edit-post-menu-item"]';
  private readonly _editCaptionInput = '[data-cy="editCaptionInput"]';
  private readonly _editImageUploadInput = '[data-cy="image-upload-input"]';
  private readonly _updatePostSubmit = '[data-testid="save-post-button"]';
  private readonly _deleteOption = '[data-testid="delete-post-button"]';
  private readonly _deletePostBtn = '[data-testid="deletePostBtn"]';

  visitPostsPage() {
    cy.get(this._postsTabButton).should('be.visible').click();
    cy.url().should('match', /\/orgpost\/[a-f0-9-]+/);
    return this;
  }

  createPost(title: string, description: string, mediaPath: string) {
    cy.get(this._createPostButton).should('be.visible').click();
    cy.get(this._postTitleInput).should('be.visible').type(title);
    cy.get(this._postDescriptionInput).should('be.visible').type(description);
    cy.get(this._addMediaField)
      .should('be.visible')
      .selectFile(mediaPath, { force: true });
    cy.get(this._pinPostCheckbox).should('be.visible').click();
    cy.get(this._createPostSubmit).should('be.visible').click();
    cy.assertToast('Congratulations! You have Posted Something.');
    return this;
  }

  editFirstPost(newTitle: string, mediaPath: string) {
    cy.get(this._postCardContainer).first().click();
    cy.get(this._moreOptionsIcon).first().should('be.visible').click();
    cy.get(this._editOption).should('be.visible').click();
    cy.get(this._editCaptionInput).should('be.visible').clear().type(newTitle);
    cy.get(this._updatePostSubmit).should('be.visible').click();
    cy.assertToast('Post updated successfully');
    return this;
  }

  deleteFirstPost() {
    cy.get(this._postCardContainer).first().click();
    cy.get(this._moreOptionsIcon).first().should('be.visible').click();
    cy.get(this._deleteOption).should('be.visible').click();
    cy.assertToast('Successfully deleted the Post.');
    return this;
  }
}
