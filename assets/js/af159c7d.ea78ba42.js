"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[58169],{28453:(e,n,s)=>{s.d(n,{R:()=>a,x:()=>o});var d=s(96540);const t={},l=d.createContext(t);function a(e){const n=d.useContext(l);return d.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:a(e.components),d.createElement(l.Provider,{value:n},e.children)}},38646:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>d,toc:()=>c});const d=JSON.parse('{"id":"auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions/default","title":"default","description":"Admin Docs","source":"@site/docs/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions/default.md","sourceDirName":"auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions","slug":"/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions/default","permalink":"/docs/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions/default","draft":false,"unlisted":false,"editUrl":"https://github.com/PalisadoesFoundation/talawa-admin/edit/develop/docs/docs/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/functions/default.md","tags":[],"version":"current","frontMatter":{},"sidebar":"tutorialSidebar","previous":{"title":"InterfaceDeletePledgeModal","permalink":"/docs/auto-docs/screens/FundCampaignPledge/deleteModal/PledgeDeleteModal/interfaces/InterfaceDeletePledgeModal"},"next":{"title":"InterfacePledgeModal","permalink":"/docs/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/interfaces/InterfacePledgeModal"}}');var t=s(74848),l=s(28453);const a={},o=void 0,i={},c=[{value:"Parameters",id:"parameters",level:2},{value:"props",id:"props",level:3},{value:"deprecatedLegacyContext?",id:"deprecatedlegacycontext",level:3},{value:"Returns",id:"returns",level:2},{value:"CSS Strategy Explanation:",id:"css-strategy-explanation",level:2},{value:"Benefits:",id:"benefits",level:3},{value:"Global CSS Classes used:",id:"global-css-classes-used",level:3}];function r(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",hr:"hr",li:"li",p:"p",strong:"strong",ul:"ul",...(0,l.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"/",children:"Admin Docs"})}),"\n",(0,t.jsx)(n.hr,{}),"\n",(0,t.jsx)(n.h1,{id:"function-default",children:"Function: default()"}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"default"}),"(",(0,t.jsx)(n.code,{children:"props"}),", ",(0,t.jsx)(n.code,{children:"deprecatedLegacyContext"}),"?): ",(0,t.jsx)(n.code,{children:"ReactNode"})]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["Defined in: ",(0,t.jsx)(n.a,{href:"https://github.com/PalisadoesFoundation/talawa-admin/blob/main/src/screens/FundCampaignPledge/modal/PledgeModal.tsx#L89",children:"src/screens/FundCampaignPledge/modal/PledgeModal.tsx:89"})]}),"\n",(0,t.jsx)(n.p,{children:"A modal dialog for creating or editing a pledge."}),"\n",(0,t.jsx)(n.h2,{id:"parameters",children:"Parameters"}),"\n",(0,t.jsx)(n.h3,{id:"props",children:"props"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"/docs/auto-docs/screens/FundCampaignPledge/modal/PledgeModal/interfaces/InterfacePledgeModal",children:(0,t.jsx)(n.code,{children:"InterfacePledgeModal"})})}),"\n",(0,t.jsx)(n.h3,{id:"deprecatedlegacycontext",children:"deprecatedLegacyContext?"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"any"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"Deprecated"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.strong,{children:"See"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods",children:"React Docs"})}),"\n",(0,t.jsx)(n.h2,{id:"returns",children:"Returns"}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.code,{children:"ReactNode"})}),"\n",(0,t.jsx)(n.p,{children:"The rendered modal component."}),"\n",(0,t.jsxs)(n.p,{children:["The ",(0,t.jsx)(n.code,{children:"PledgeModal"})," component displays a form within a modal dialog for creating or editing a pledge.\nIt includes fields for selecting users, entering an amount, choosing a currency, and setting start and end dates for the pledge."]}),"\n",(0,t.jsx)(n.p,{children:"The modal includes:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"A header with a title indicating the current mode (create or edit) and a close button."}),"\n",(0,t.jsxs)(n.li,{children:["A form with:","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"A multi-select dropdown for selecting users to participate in the pledge."}),"\n",(0,t.jsx)(n.li,{children:"Date pickers for selecting the start and end dates of the pledge."}),"\n",(0,t.jsx)(n.li,{children:"A dropdown for selecting the currency of the pledge amount."}),"\n",(0,t.jsx)(n.li,{children:"An input field for entering the pledge amount."}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.li,{children:"A submit button to create or update the pledge."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"On form submission, the component either:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["Calls ",(0,t.jsx)(n.code,{children:"updatePledge"})," mutation to update an existing pledge, or"]}),"\n",(0,t.jsxs)(n.li,{children:["Calls ",(0,t.jsx)(n.code,{children:"createPledge"})," mutation to create a new pledge."]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"Success or error messages are displayed using toast notifications based on the result of the mutation."}),"\n",(0,t.jsx)(n.h2,{id:"css-strategy-explanation",children:"CSS Strategy Explanation:"}),"\n",(0,t.jsxs)(n.p,{children:["To ensure consistency across the application and reduce duplication, common styles\n(such as button styles) have been moved to the global CSS file. Instead of using\ncomponent-specific classes (e.g., ",(0,t.jsx)(n.code,{children:".greenregbtnOrganizationFundCampaign"}),", ",(0,t.jsx)(n.code,{children:".greenregbtnPledge"}),"), a single reusable\nclass (e.g., .addButton) is now applied."]}),"\n",(0,t.jsx)(n.h3,{id:"benefits",children:"Benefits:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"**Reduces redundant CSS code."}),"\n",(0,t.jsx)(n.li,{children:"**Improves maintainability by centralizing common styles."}),"\n",(0,t.jsx)(n.li,{children:"**Ensures consistent styling across components."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"global-css-classes-used",children:"Global CSS Classes used:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:(0,t.jsx)(n.code,{children:".addButton"})}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"For more details on the reusable classes, refer to the global CSS file."})]})}function u(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(r,{...e})}):r(e)}}}]);