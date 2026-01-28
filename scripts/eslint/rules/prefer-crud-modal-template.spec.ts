import { RuleTester, Rule } from 'eslint';
import preferCrudModalTemplate from './prefer-crud-modal-template.ts';
import { describe } from 'vitest';
import parser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
  languageOptions: {
    parser,
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});
const rule = preferCrudModalTemplate as unknown as Rule.RuleModule;

describe('prefer-crud-modal-template', () => {
  ruleTester.run('prefer-crud-modal-template', rule, {
    valid: [
      // Valid: BaseModal without CRUD props or forms
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onClose={() => {}} title="Basic Modal" />;
          }
        `,
      },

      // Valid: Using CRUDModalTemplate instead
      {
        code: `
          import { CRUDModalTemplate } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <CRUDModalTemplate onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Valid: BaseModal with non-CRUD props
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onClose={() => {}} onShow={() => {}} title="Modal" />;
          }
        `,
      },

      // Valid: BaseModal without form elements
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <div>Just some content</div>
                <p>No forms here</p>
              </BaseModal>
            );
          }
        `,
      },

      // Valid: Different component with CRUD props
      {
        code: `
          import { SomeOtherModal } from 'components/SomeOtherModal';
          function Component() {
            return <SomeOtherModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Valid: File in ignore path
      {
        filename: 'src/test/ignored-file.tsx',
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        options: [{ ignorePaths: ['src/test/**'] }],
      },

      // Valid: JSX Member Expression not matching target
      {
        code: `
          import * as UI from 'shared-components/BaseModal';
          function Component() {
            return <UI.SomeOtherModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Valid: Namespace import with non-BaseModal usage
      {
        code: `
          import * as Components from 'shared-components/BaseModal';
          function Component() {
            return <Components.Button onClick={() => {}} />;
          }
        `,
      },

      // Valid: Import path not matching patterns
      {
        code: `
          import { BaseModal } from 'completely-different-library';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Valid: Import with index path that matches variants
      {
        code: `
          import { SomeComponent } from 'shared-components/BaseModal/index';
          function Component() {
            return <SomeComponent onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Valid: JSX with spread attribute (not detected as CRUD props)
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal {...props} onClose={() => {}} />;
          }
        `,
      },
    ],

    invalid: [
      // Invalid: BaseModal with onSubmit prop
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: BaseModal with onConfirm prop
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onConfirm={handleConfirm} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onConfirm={handleConfirm} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: BaseModal with onPrimary prop
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onPrimary={handlePrimary} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onPrimary={handlePrimary} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: BaseModal with onSave prop
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSave={handleSave} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSave={handleSave} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: BaseModal with form elements in children
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <form onSubmit={handleSubmit}>
                  <input type="text" />
                </form>
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <form onSubmit={handleSubmit}>
                  <input type="text" />
                </form>
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: BaseModal with Form component (capitalized)
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <Form onSubmit={handleSubmit}>
                  <input type="text" />
                </Form>
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <Form onSubmit={handleSubmit}>
                  <input type="text" />
                </Form>
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Named import with alias
      {
        code: `
          import { BaseModal as MyModal } from 'shared-components/BaseModal';
          function Component() {
            return <MyModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as MyModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <MyModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Default import
      {
        code: `
          import BaseModal from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Multiple imports with BaseModal
      {
        code: `
          import { BaseModal, Button } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { Button } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Default and named imports
      {
        code: `
          import SomeDefault, { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import SomeDefault from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Form in nested children
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <div>
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input type="text" />
                    </form>
                  </div>
                </div>
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <div>
                  <div>
                    <form onSubmit={handleSubmit}>
                      <input type="text" />
                    </form>
                  </div>
                </div>
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Form in JSX expression
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {showForm && <form onSubmit={handleSubmit}><input /></form>}
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {showForm && <form onSubmit={handleSubmit}><input /></form>}
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Form in conditional expression
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {condition ? <form onSubmit={handleSubmit}><input /></form> : <div>No form</div>}
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {condition ? <form onSubmit={handleSubmit}><input /></form> : <div>No form</div>}
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Form in JSX fragment
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <>
                  <form onSubmit={handleSubmit}>
                    <input type="text" />
                  </form>
                </>
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                <>
                  <form onSubmit={handleSubmit}>
                    <input type="text" />
                  </form>
                </>
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Custom keywords option
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onCustomAction={handleAction} onClose={() => {}} />;
          }
        `,
        options: [{ keywords: ['onCustomAction'] }],
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onCustomAction={handleAction} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Custom variants option
      {
        code: `
          import { CustomModal } from 'shared-components/CustomModal';
          function Component() {
            return <CustomModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        options: [{ variants: ['CustomModal'] }],
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as CustomModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <CustomModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import path patterns option
      {
        code: `
          import { SomeModal } from 'ui/modals/SomeModal';
          function Component() {
            return <SomeModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        options: [
          { importPathPatterns: ['ui/modals/*'], variants: ['SomeModal'] },
        ],
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as SomeModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <SomeModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Multiple CRUD props
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal 
                onSubmit={handleSubmit} 
                onConfirm={handleConfirm}
                onClose={() => {}} 
              />
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal 
                onSubmit={handleSubmit} 
                onConfirm={handleConfirm}
                onClose={() => {}} 
              />
            );
          }
        `,
      },

      // Invalid: Type import that becomes value import
      {
        code: `
          import { type BaseModal as ModalType } from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { type BaseModal as ModalType } from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Namespace import with default and named specifiers
      {
        code: `
          import SomeDefault, * as Namespace from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import SomeDefault, * as Namespace from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Complex import with type and value imports
      {
        code: `
          import { type SomeType, BaseModal, OtherComponent } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { type SomeType, OtherComponent } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import with type specifier for BaseModal
      {
        code: `
          import { type BaseModal, Button } from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { type BaseModal, Button } from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import with both default and namespace
      {
        code: `
          import DefaultExport, * as AllExports from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import DefaultExport, * as AllExports from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Wildcard import path pattern
      {
        code: `
          import { TestModal } from 'components/modals/TestModal';
          function Component() {
            return <TestModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        options: [
          {
            importPathPatterns: ['components/modals/*'],
            variants: ['TestModal'],
          },
        ],
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as TestModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <TestModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Form in logical expression (both sides)
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {isEdit ? <form onSubmit={handleSubmit}><input /></form> : showCreate && <form onSubmit={handleCreate}><input /></form>}
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {isEdit ? <form onSubmit={handleSubmit}><input /></form> : showCreate && <form onSubmit={handleCreate}><input /></form>}
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Empty JSX expression container
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {/* empty expression */}
                {}
                <form onSubmit={handleSubmit}><input /></form>
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {/* empty expression */}
                {}
                <form onSubmit={handleSubmit}><input /></form>
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Exact importPathPatterns match without wildcard
      {
        code: `
          import { TestModal } from 'exact/path/TestModal';
          function Component() {
            return <TestModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        options: [
          {
            importPathPatterns: ['exact/path/TestModal'],
            variants: ['TestModal'],
          },
        ],
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as TestModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <TestModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Form in logical expression (left side)
      {
        code: `
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {<form onSubmit={handleSubmit}><input /></form> && showExtra}
              </BaseModal>
            );
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return (
              <BaseModal onClose={() => {}}>
                {<form onSubmit={handleSubmit}><input /></form> && showExtra}
              </BaseModal>
            );
          }
        `,
      },

      // Invalid: Import with default export only
      {
        code: `
          import DefaultModal from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import DefaultModal from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import reconstruction with namespace only (no named specifiers)
      {
        code: `
          import * as Modals from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import * as Modals from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import with default and namespace, no named specifiers
      {
        code: `
          import DefaultModal, * as AllModals from 'shared-components/BaseModal';
          import { BaseModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 5,
          },
        ],
        output: `
          import DefaultModal, * as AllModals from 'shared-components/BaseModal';
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },

      // Invalid: Import with default and named specifiers
      {
        code: `
          import DefaultModal, { BaseModal, OtherModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
        errors: [
          {
            messageId: 'preferCrud',
            line: 4,
          },
        ],
        output: `
          import { CRUDModalTemplate as BaseModal } from 'shared-components/CRUDModalTemplate/CRUDModalTemplate';
import DefaultModal, { OtherModal } from 'shared-components/BaseModal';
          function Component() {
            return <BaseModal onSubmit={handleSubmit} onClose={() => {}} />;
          }
        `,
      },
    ],
  });
});
