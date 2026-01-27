import { RuleTester } from 'eslint';
import rule from './prefer-crud-modal-template.ts';
import tsParser from '@typescript-eslint/parser';

const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});

ruleTester.run('prefer-crud-modal-template', rule, {
  valid: [
    // Standard usage of CRUDModalTemplate
    {
      code: `
        import { CRUDModalTemplate } from 'src/shared-components/CRUDModalTemplate/CRUDModalTemplate';
        export const MyModal = () => (
          <CRUDModalTemplate title="Test" onSubmit={() => {}}>
            <div>Content</div>
          </CRUDModalTemplate>
        );
      `,
    },
    // BaseModal without CRUD props or form
    {
      code: `
        import { BaseModal } from 'src/shared-components/BaseModal';
        export const InfoModal = () => (
          <BaseModal title="Info">
            <div>Just info text</div>
          </BaseModal>
        );
      `,
    },
    // Ignored file path
    {
      code: `
        import { BaseModal } from 'src/shared-components/BaseModal';
        export const MyModal = () => (
          <BaseModal onSubmit={() => {}}>
            <form>Content</form>
          </BaseModal>
        );
      `,
      filename: 'src/ignored/file.tsx',
      options: [{ ignorePaths: ['src/ignored/**'] }],
    },
    // Different component name that isn't targeted
    {
      code: `
        import { OtherModal } from 'other-lib';
        export const MyModal = () => (
          <OtherModal onSubmit={() => {}}>
            <form>Content</form>
          </OtherModal>
        );
      `,
    },
  ],

  invalid: [
    // BaseModal with onSubmit
    {
      code: `
        import { BaseModal } from 'src/shared-components/BaseModal';
        export const CreateModal = () => (
          <BaseModal title="Create" onSubmit={handleSubmit}>
            <div>Content</div>
          </BaseModal>
        );
      `,
      errors: [{ messageId: 'preferCrud' }],
      output: `
        import { CRUDModalTemplate as BaseModal } from 'src/shared-components/CRUDModalTemplate/CRUDModalTemplate';
        export const CreateModal = () => (
          <BaseModal title="Create" onSubmit={handleSubmit}>
            <div>Content</div>
          </BaseModal>
        );
      `,
    },
    // BaseModal with form element child
    {
      code: `
        import { BaseModal } from 'src/shared-components/BaseModal';
        export const FormModal = () => (
          <BaseModal title="Form">
            <form>
              <input />
            </form>
          </BaseModal>
        );
      `,
      errors: [{ messageId: 'preferCrud' }],
      output: `
        import { CRUDModalTemplate as BaseModal } from 'src/shared-components/CRUDModalTemplate/CRUDModalTemplate';
        export const FormModal = () => (
          <BaseModal title="Form">
            <form>
              <input />
            </form>
          </BaseModal>
        );
      `,
    },
    // Aliased import
    {
      code: `
        import { BaseModal as MyModal } from 'src/shared-components/BaseModal';
        export const CreateModal = () => (
          <MyModal onSubmit={handleSubmit}>
            <div>Content</div>
          </MyModal>
        );
      `,
      errors: [{ messageId: 'preferCrud' }],
      output: `
        import { CRUDModalTemplate as MyModal } from 'src/shared-components/CRUDModalTemplate/CRUDModalTemplate';
        export const CreateModal = () => (
          <MyModal onSubmit={handleSubmit}>
            <div>Content</div>
          </MyModal>
        );
      `,
    },
    // Mixed imports (named + default or multiple named) - preserving others
    {
      code: `
        import { BaseModal, OtherComponent } from 'src/shared-components/BaseModal';
        export const CreateModal = () => (
          <BaseModal onSubmit={handleSubmit}>
            <OtherComponent />
          </BaseModal>
        );
      `,
      errors: [{ messageId: 'preferCrud' }],
      output: `
        import { CRUDModalTemplate as BaseModal } from 'src/shared-components/CRUDModalTemplate/CRUDModalTemplate';
import { OtherComponent } from 'src/shared-components/BaseModal';
        export const CreateModal = () => (
          <BaseModal onSubmit={handleSubmit}>
            <OtherComponent />
          </BaseModal>
        );
      `,
    },
  ],
});
