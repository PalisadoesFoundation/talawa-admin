import React from 'react';

/**
 * This fixture contains patterns that should NOT be flagged as violations.
 * All patterns are legitimate false positives that the enhanced script should handle.
 */

export function FalsePositivesFixture() {
  const age = 25;
  const dialogRedirectOrgId = '123';
  const styles = {
    orgImgContainer: 'container',
    button: 'btn',
    pluginStoreBtn: 'plugin',
  };

  return (
    <div>
      {/* TypeScript type annotations - should be skipped */}
      {(() => {
        const fn = (): string => 'OK';
        const handler = async (): Promise<void> => {
          return Promise.resolve();
        };
        void fn();
        void handler();
        return null;
      })()}

      {/* CSS classes in className - should be skipped */}
      <div className={`btn primary m-3 p-2`} />
      <div className={`mx-1 ${age > 20 ? 'my-4' : 'my-0'}`} />
      <div className={`container shimmer`} />
      <div className={`${styles.orgImgContainer} shimmer`} />
      <div className={`shimmer ${styles.button}`} />
      <div className={`btn btn-primary ${styles.pluginStoreBtn}`} />
      <i className="fi fi-rr-home me-2" />
      <i className="fa fa-times" />

      {/* Date formats - should be skipped */}
      <input placeholder="YYYY-MM-DD" />
      <div>{`YYYY-MM-DDTHH:mm:ss.SSS[Z]`}</div>
      <div>{`HH:mm:ss`}</div>

      {/* Technical attributes - should be skipped */}
      <div data-testid="my-test" role="button" aria-hidden="true" />

      {/* URL patterns - should be skipped */}
      <a href="orgstore/id=123" />
      <a href={`orgstore/id=${dialogRedirectOrgId}`} />
      <a href="api/v1/users" />
      <img src="/assets/logo.png" alt="" />
      <link href="data:image/png;base64,abc" />

      {/* JavaScript operators in expressions - should be skipped */}
      <div>{age >= 18 && age <= 40}</div>
      <div>{age === 25 || age !== 30}</div>
    </div>
  );
}

/**
 * Examples showing how to use ignore comments.
 * Note: Place comments on the line BEFORE the violation or on the SAME line.
 */
// export function IgnoreCommentsExample() {
//   return (
//     <div>
//       {/* Using i18n-ignore-line (same line) */}
//       <div>API_CONSTANT</div> {/* i18n-ignore-line */}

//       {/* Using i18n-ignore-next-line (previous line) */}
//       {/* i18n-ignore-next-line */}
//       <span>INTERNAL_ID</span>
//     </div>
//   );
// }
