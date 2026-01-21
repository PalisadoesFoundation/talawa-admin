import { TSESLint } from '@typescript-eslint/utils';
import rule from './prefer-crud-modal-template.js';

const ruleTester = new TSESLint.RuleTester({
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

ruleTester.run('prefer-crud-modal-template', rule, {
  valid: [
    // BaseModal without CRUD props - should be valid
    {
      name: 'BaseModal without CRUD props',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onClose={() => {}}>
              <div>Regular content</div>
            </BaseModal>
          );
        }
      `,
    },
    // BaseModal with onHide prop only - should be valid
    {
      name: 'BaseModal with onHide prop only',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onHide={() => {}}>
              <p>Display content</p>
            </BaseModal>
          );
        }
      `,
    },
    // Named import without CRUD props - should be valid
    {
      name: 'Named import without CRUD props',
      code: `
        import { BaseModal } from '../../components';
        function Example() {
          return (
            <BaseModal show={true} title="Info">
              <p>Information display</p>
            </BaseModal>
          );
        }
      `,
    },
    // Aliased import without CRUD props - should be valid
    {
      name: 'Aliased import without CRUD props',
      code: `
        import { BaseModal as MyModal } from '../../components';
        function Example() {
          return (
            <MyModal show={true} onCancel={() => {}}>
              <div>Content</div>
            </MyModal>
          );
        }
      `,
    },
    // No BaseModal import - should be valid
    {
      name: 'Different component with CRUD props',
      code: `
        import CRUDModal from '../../components/CRUDModal';
        function Example() {
          return (
            <CRUDModal show={true} onSubmit={() => {}}>
              <form>
                <input type="text" />
              </form>
            </CRUDModal>
          );
        }
      `,
    },
  ],
  invalid: [
    // Default import with onSubmit prop
    {
      name: 'Default import with onSubmit prop',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onSubmit={() => {}}>
              <div>Form content</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Default import with onConfirm prop
    {
      name: 'Default import with onConfirm prop',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onConfirm={() => {}}>
              <div>Confirmation content</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Default import with onPrimary prop
    {
      name: 'Default import with onPrimary prop',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onPrimary={() => {}}>
              <div>Primary action</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Default import with onSave prop
    {
      name: 'Default import with onSave prop',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onSave={() => {}}>
              <div>Save content</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Named import with onSubmit prop
    {
      name: 'Named import with onSubmit prop',
      code: `
        import { BaseModal } from '../../components';
        function Example() {
          return (
            <BaseModal show={true} onSubmit={() => {}}>
              <div>Form content</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Aliased import with onConfirm prop
    {
      name: 'Aliased import with onConfirm prop',
      code: `
        import { BaseModal as MyModal } from '../../components';
        function Example() {
          return (
            <MyModal show={true} onConfirm={() => {}}>
              <div>Confirmation</div>
            </MyModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Multiple CRUD props
    {
      name: 'Multiple CRUD props',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onSubmit={() => {}} onSave={() => {}}>
              <div>Content</div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // BaseModal with form element in children
    {
      name: 'BaseModal with form element in children',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true}>
              <form>
                <input type="text" name="username" />
                <button type="submit">Submit</button>
              </form>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // BaseModal with Form component (capitalized) in children
    {
      name: 'BaseModal with Form component in children',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true}>
              <Form>
                <input type="text" />
              </Form>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // BaseModal with nested form in children
    {
      name: 'BaseModal with nested form in children',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true}>
              <div>
                <div>
                  <form>
                    <input type="text" />
                  </form>
                </div>
              </div>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // BaseModal with form in fragment children
    {
      name: 'BaseModal with form in fragment children',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true}>
              <>
                <h2>Title</h2>
                <form>
                  <input type="text" />
                </form>
              </>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // Aliased import with form element
    {
      name: 'Aliased import with form element',
      code: `
        import { BaseModal as MyModal } from '../../components';
        function Example() {
          return (
            <MyModal show={true}>
              <form onSubmit={() => {}}>
                <input type="text" />
              </form>
            </MyModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
    // BaseModal with both CRUD prop and form element
    {
      name: 'BaseModal with both CRUD prop and form element',
      code: `
        import BaseModal from '../../components/BaseModal';
        function Example() {
          return (
            <BaseModal show={true} onSubmit={() => {}}>
              <form>
                <input type="text" />
              </form>
            </BaseModal>
          );
        }
      `,
      errors: [{ messageId: 'preferCrud' }],
    },
  ],
});
