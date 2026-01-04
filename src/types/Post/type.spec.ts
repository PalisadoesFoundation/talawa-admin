import { describe, it, expect } from 'vitest';
import type {
  Post,
  PostInput,
  PostUpdateInput,
  PostWhereInput,
  PostOrderByInput,
  PostComments,
  PostLikes,
  PostNode,
} from './type';
import { PostOrderByInputEnum } from './type';
import type { VoteState } from 'utils/interfaces';
import dayjs from 'dayjs';

describe('Post Type Definitions Tests', () => {
  // Test 1: Post type
  describe('Post Type', () => {
    it('should accept valid post with all fields', () => {
      const validPost: Post = {
        _id: 'post123',
        text: 'Sample post text',
        // Use dynamic dates to avoid test staleness
        createdAt: dayjs().subtract(30, 'days').toDate(),
        updatedAt: dayjs().subtract(30, 'days').toDate(),
        organization: {
          _id: 'org123',
          name: 'Test Organization',
          description: 'Test description',
          apiUrl: 'https://example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          customFields: [],
          userRegistrationRequired: false,
          visibleInSearch: true,
        },

        title: 'Sample Title',
        imageUrl: 'https://example.com/image.jpg',
        videoUrl: 'https://example.com/video.mp4',
        likeCount: 10,
        commentCount: 5,
        pinned: false,
      };

      expect(validPost._id).toBe('post123');
      expect(validPost.text).toBe('Sample post text');
      expect(validPost.likeCount).toBe(10);
    });

    it('should work with only required fields', () => {
      const minimalPost: Post = {
        text: 'Minimal post',
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: {
          _id: 'org123',
          name: 'Test Organization',
          description: 'Test description',
          apiUrl: 'https://example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          customFields: [],
          userRegistrationRequired: false,
          visibleInSearch: true,
        },
      };

      expect(minimalPost.text).toBe('Minimal post');
      expect(minimalPost._id).toBeUndefined();
    });

    it('should allow optional creator field', () => {
      const postWithCreator: Post = {
        text: 'Post with creator',
        createdAt: new Date(),
        updatedAt: new Date(),
        organization: {
          _id: 'org123',
          name: 'Test Organization',
          description: 'Test description',
          apiUrl: 'https://example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          customFields: [],
          userRegistrationRequired: false,
          visibleInSearch: true,
        },

        creator: {
          _id: 'user123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          createdAt: new Date(),
        },
      };

      expect(postWithCreator.creator).toBeDefined();
      expect(postWithCreator.creator?.firstName).toBe('John');
    });
  });

  // Test 2: PostInput type
  describe('PostInput Type', () => {
    it('should accept valid input for creating post', () => {
      const postInput: PostInput = {
        organizationId: 'org123',
        text: 'New post text',
        title: 'New Post',
        imageUrl: 'https://example.com/new.jpg',
        pinned: true,
      };

      expect(postInput.organizationId).toBe('org123');
      expect(postInput.text).toBe('New post text');
    });

    it('should work with only required fields', () => {
      const minimalInput: PostInput = {
        organizationId: 'org456',
        text: 'Simple text',
      };

      expect(minimalInput.organizationId).toBe('org456');
      expect(minimalInput.title).toBeUndefined();
    });
  });

  // Test 3: PostOrderByInputEnum
  describe('PostOrderByInputEnum', () => {
    it('should have all sorting options', () => {
      expect(PostOrderByInputEnum.CREATED_AT_DESC).toBe('createdAt_DESC');
      expect(PostOrderByInputEnum.LIKE_COUNT_DESC).toBe('likeCount_DESC');
      expect(PostOrderByInputEnum.COMMENT_COUNT_ASC).toBe('commentCount_ASC');
      expect(PostOrderByInputEnum.TEXT_ASC).toBe('text_ASC');
      expect(PostOrderByInputEnum.TITLE_DESC).toBe('title_DESC');
    });

    it('should allow valid order by values', () => {
      const orderBy: PostOrderByInput = PostOrderByInputEnum.CREATED_AT_DESC;
      expect(orderBy).toBe('createdAt_DESC');
    });

    it('should contain all expected enum keys', () => {
      const keys = Object.keys(PostOrderByInputEnum);
      expect(keys).toContain('CREATED_AT_ASC');
      expect(keys).toContain('CREATED_AT_DESC');
      expect(keys).toContain('LIKE_COUNT_ASC');
      expect(keys).toContain('LIKE_COUNT_DESC');
      expect(keys).toContain('COMMENT_COUNT_ASC');
      expect(keys).toContain('COMMENT_COUNT_DESC');
      expect(keys).toContain('TEXT_ASC');
      expect(keys).toContain('TEXT_DESC');
      expect(keys).toContain('TITLE_ASC');
      expect(keys).toContain('TITLE_DESC');
      expect(keys).toContain('IMAGE_URL_ASC');
      expect(keys).toContain('IMAGE_URL_DESC');
      expect(keys).toContain('VIDEO_URL_ASC');
      expect(keys).toContain('VIDEO_URL_DESC');
      expect(keys).toContain('ID_ASC');
      expect(keys).toContain('ID_DESC');
    });
  });

  // Test 4: PostUpdateInput
  describe('PostUpdateInput Type', () => {
    it('should accept partial update data', () => {
      const updateData: PostUpdateInput = {
        text: 'Updated text',
        title: 'Updated title',
      };

      expect(updateData.text).toBe('Updated text');
    });

    it('should allow empty update object', () => {
      const emptyUpdate: PostUpdateInput = {};
      expect(Object.keys(emptyUpdate)).toHaveLength(0);
    });

    it('should allow updating only image', () => {
      const imageUpdate: PostUpdateInput = {
        imageUrl: 'https://example.com/new-image.jpg',
      };
      expect(imageUpdate.imageUrl).toBe('https://example.com/new-image.jpg');
    });
  });

  // Test 5: PostWhereInput
  describe('PostWhereInput Type', () => {
    it('should accept search criteria', () => {
      const searchCriteria: PostWhereInput = {
        text_contains: 'search term',
        title_starts_with: 'Important',
        id_in: ['post1', 'post2', 'post3'],
      };

      expect(searchCriteria.text_contains).toBe('search term');
      expect(searchCriteria.id_in).toHaveLength(3);
    });

    it('should support NOT filters', () => {
      const notFilter: PostWhereInput = {
        id_not: 'post123',
        text_not_in: ['spam', 'unwanted'],
      };

      expect(notFilter.id_not).toBe('post123');
      expect(notFilter.text_not_in).toContain('spam');
    });

    it('should allow single field filter', () => {
      const simpleFilter: PostWhereInput = {
        id: 'post123',
      };

      expect(simpleFilter.id).toBe('post123');
    });
  });

  // Test 6: PostComments
  describe('PostComments Type', () => {
    it('should accept array of comments', () => {
      const comments: PostComments = [
        {
          id: 'comment1',
          creator: {
            id: 'user1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
          },
          likeCount: 5,
          text: 'Great post!',
        },
      ];

      expect(comments).toHaveLength(1);
      expect(comments[0].text).toBe('Great post!');
    });

    it('should allow empty comments array', () => {
      const noComments: PostComments = [];
      expect(noComments).toHaveLength(0);
    });
  });

  // Test 7: PostLikes
  describe('PostLikes Type', () => {
    it('should accept array of likes', () => {
      const likes: PostLikes = [
        { id: 'user1', name: 'John Doe' },
        { id: 'user2', name: 'Jane Smith' },
      ];

      expect(likes).toHaveLength(2);
      expect(likes[0].name).toBe('John Doe');
    });

    it('should allow empty likes array', () => {
      const noLikes: PostLikes = [];
      expect(noLikes).toHaveLength(0);
    });
  });

  // Test 8: PostNode
  describe('PostNode Type', () => {
    it('should accept complete GraphQL post node', () => {
      const postNode: PostNode = {
        id: 'post123',
        caption: 'Caption text',
        createdAt: dayjs().subtract(30, 'days').toISOString(),
        commentCount: 5,
        creator: {
          id: 'user123',
          name: 'John Doe',
          emailAddress: 'john@example.com',
        },
        hasUserVoted: 'UPVOTE' as unknown as VoteState,
        upVotesCount: 10,
        downVotesCount: 2,
        pinnedAt: null,
        downVoters: { edges: [] },
        attachments: [],
        commentsCount: 5,
      };

      expect(postNode.id).toBe('post123');
      expect(postNode.creator.name).toBe('John Doe');
    });

    it('should handle null values', () => {
      const postWithNulls: PostNode = {
        id: 'post456',
        caption: null,
        pinnedAt: null,
        createdAt: dayjs().subtract(30, 'days').toISOString(),
        commentCount: 0,
        creator: {
          id: 'user456',
          name: 'Test User',
          emailAddress: 'test@example.com',
        },
        hasUserVoted: 'UPVOTE' as unknown as VoteState,
        upVotesCount: 0,
        downVotesCount: 0,
        downVoters: { edges: [] },
        attachments: [],
        commentsCount: 0,
      };

      expect(postWithNulls.caption).toBeNull();
      expect(postWithNulls.pinnedAt).toBeNull();
    });

    it('should handle comments in PostNode', () => {
      const postWithComments: PostNode = {
        id: 'post789',
        caption: 'Test',
        createdAt: dayjs().subtract(30, 'days').toISOString(),
        commentCount: 1,
        creator: {
          id: 'user789',
          name: 'Test User',
          emailAddress: 'test@test.com',
        },
        hasUserVoted: 'UPVOTE' as unknown as VoteState,
        upVotesCount: 0,
        downVotesCount: 0,
        pinnedAt: null,
        downVoters: { edges: [] },
        attachments: [],
        commentsCount: 1,
        comments: {
          edges: [
            {
              node: {
                id: 'comment1',
                body: 'Test comment',
                creator: {
                  id: 'user1',
                  name: 'Commenter',
                  emailAddress: 'commenter@test.com',
                },
                hasUserVoted: 'UPVOTE' as unknown as VoteState,
                downVotesCount: 0,
                upVotesCount: 0,
                text: 'Comment text',
              },
            },
          ],
        },
      };

      expect(postWithComments.comments?.edges).toHaveLength(1);
      expect(postWithComments.comments?.edges[0].node.text).toBe(
        'Comment text',
      );
    });
  });
});
