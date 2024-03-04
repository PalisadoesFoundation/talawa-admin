"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var react_bootstrap_1 = require("react-bootstrap");
var OrganizationFunds_module_css_1 = require("./OrganizationFunds.module.css");
var FundCreateModal = function (_a) {
    var fundCreateModalIsOpen = _a.fundCreateModalIsOpen, hideCreateModal = _a.hideCreateModal, formState = _a.formState, setFormState = _a.setFormState, createFundHandler = _a.createFundHandler, taxDeductible = _a.taxDeductible, setTaxDeductible = _a.setTaxDeductible, isArchived = _a.isArchived, setIsArchived = _a.setIsArchived, isDefault = _a.isDefault, setIsDefault = _a.setIsDefault, t = _a.t;
    return (React.createElement(React.Fragment, null,
        React.createElement(react_bootstrap_1.Modal, { className: OrganizationFunds_module_css_1["default"].fundModal, show: fundCreateModalIsOpen, onHide: hideCreateModal },
            React.createElement(react_bootstrap_1.Modal.Header, null,
                React.createElement("p", { className: OrganizationFunds_module_css_1["default"].titlemodal },
                    " ",
                    t('fundCreate')),
                React.createElement(react_bootstrap_1.Button, { variant: "danger", onClick: hideCreateModal, "data-testid": "createFundModalCloseBtn" },
                    React.createElement("i", { className: "fa fa-times" }))),
            React.createElement(react_bootstrap_1.Modal.Body, null,
                React.createElement(react_bootstrap_1.Form, { onSubmitCapture: createFundHandler },
                    React.createElement(react_bootstrap_1.Form.Group, { className: "mb-3" },
                        React.createElement(react_bootstrap_1.Form.Label, null,
                            t('fundName'),
                            " "),
                        React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: t('enterfundName'), value: formState.fundName, onChange: function (e) {
                                return setFormState(__assign(__assign({}, formState), { fundName: e.target.value }));
                            } })),
                    React.createElement(react_bootstrap_1.Form.Group, { className: "mb-3" },
                        React.createElement(react_bootstrap_1.Form.Label, null,
                            " ",
                            t('fundId'),
                            " "),
                        React.createElement(react_bootstrap_1.Form.Control, { type: "text", placeholder: t('enterfundId'), value: formState.fundRef, onChange: function (e) {
                                return setFormState(__assign(__assign({}, formState), { fundRef: e.target.value }));
                            } })),
                    React.createElement("div", { className: "d-flex-col " },
                        React.createElement(react_bootstrap_1.Form.Group, { className: "mb-3" },
                            React.createElement("div", { className: "d-flex justify-content-end" },
                                React.createElement("label", null,
                                    t('taxDeductible'),
                                    " "),
                                React.createElement(react_bootstrap_1.Form.Switch, { type: "checkbox", checked: taxDeductible, className: "ms-2", onChange: function () { return setTaxDeductible(!taxDeductible); } }))),
                        React.createElement(react_bootstrap_1.Form.Group, { className: "mb-3" },
                            React.createElement("div", { className: "d-flex justify-content-end" },
                                React.createElement("label", null,
                                    t('default'),
                                    " "),
                                React.createElement(react_bootstrap_1.Form.Switch, { type: "checkbox", className: "ms-2", checked: isDefault, onChange: function () { return setIsDefault(!isDefault); } })))),
                    React.createElement(react_bootstrap_1.Button, { type: "submit", className: OrganizationFunds_module_css_1["default"].greenregbtn, "data-testid": "createFundFormSubmitBtn" }, t('fundCreate')))))));
};
exports["default"] = FundCreateModal;
