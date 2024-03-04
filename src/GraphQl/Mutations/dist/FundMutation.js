"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
exports.__esModule = true;
exports.REMOVE_FUND_MUTATION = exports.UPDATE_FUND_MUTATION = exports.CREATE_FUND_MUTATION = void 0;
var graphql_tag_1 = require("graphql-tag");
/**
 * GraphQL mutation to create a new fund.
 *
 * @param name - The name of the fund.
 * @param organizationId - The organization ID the fund is associated with.
 * @param refrenceNumber - The reference number of the fund.
 * @param taxDeductible - Whether the fund is tax deductible.
 * @param isArchived - Whether the fund is archived.
 * @param isDefault - Whether the fund is the default.
 * @returns The ID of the created fund.
 */
exports.CREATE_FUND_MUTATION = graphql_tag_1["default"](templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  mutation CreateFund(\n    $name: String!\n    $organizationId: ID!\n    $refrenceNumber: String\n    $taxDeductible: Boolean!\n    $isArchived: Boolean!\n    $isDefault: Boolean!\n  ) {\n    createFund(\n      data: {\n        name: $name\n        organizationId: $organizationId\n        refrenceNumber: $refrenceNumber\n        taxDeductible: $taxDeductible\n        isArchived: $isArchived\n        isDefault: $isDefault\n      }\n    ) {\n      _id\n    }\n  }\n"], ["\n  mutation CreateFund(\n    $name: String!\n    $organizationId: ID!\n    $refrenceNumber: String\n    $taxDeductible: Boolean!\n    $isArchived: Boolean!\n    $isDefault: Boolean!\n  ) {\n    createFund(\n      data: {\n        name: $name\n        organizationId: $organizationId\n        refrenceNumber: $refrenceNumber\n        taxDeductible: $taxDeductible\n        isArchived: $isArchived\n        isDefault: $isDefault\n      }\n    ) {\n      _id\n    }\n  }\n"])));
/**
 * GraphQL mutation to update a fund.
 *
 * @param id - The ID of the fund being updated.
 * @param name - The name of the fund.
 * @param taxDeductible - Whether the fund is tax deductible.
 * @param isArchived - Whether the fund is archived.
 * @param isDefault - Whether the fund is the default.
 * @returns The ID of the updated fund.
 */
exports.UPDATE_FUND_MUTATION = graphql_tag_1["default"](templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n  mutation UpdateFund(\n    $id: ID!\n    $name: String\n    $taxDeductible: Boolean\n    $isArchived: Boolean\n    $isDefault: Boolean\n  ) {\n    updateFund(\n      id: $id\n      data: {\n        name: $name\n        taxDeductible: $taxDeductible\n        isArchived: $isArchived\n        isDefault: $isDefault\n      }\n    ) {\n      _id\n    }\n  }\n"], ["\n  mutation UpdateFund(\n    $id: ID!\n    $name: String\n    $taxDeductible: Boolean\n    $isArchived: Boolean\n    $isDefault: Boolean\n  ) {\n    updateFund(\n      id: $id\n      data: {\n        name: $name\n        taxDeductible: $taxDeductible\n        isArchived: $isArchived\n        isDefault: $isDefault\n      }\n    ) {\n      _id\n    }\n  }\n"])));
/**
 * GraphQL mutation to remove a fund.
 *
 * @param id - The ID of the fund being removed.
 * @returns The ID of the removed fund.
 */
exports.REMOVE_FUND_MUTATION = graphql_tag_1["default"](templateObject_3 || (templateObject_3 = __makeTemplateObject(["\n  mutation RemoveFund($id: ID!) {\n    removeFund(id: $id) {\n      _id\n    }\n  }\n"], ["\n  mutation RemoveFund($id: ID!) {\n    removeFund(id: $id) {\n      _id\n    }\n  }\n"])));
var templateObject_1, templateObject_2, templateObject_3;
