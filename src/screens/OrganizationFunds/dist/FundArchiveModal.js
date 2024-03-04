"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_bootstrap_1 = require("react-bootstrap");
var OrganizationFunds_module_css_1 = require("./OrganizationFunds.module.css");
var FundArchiveModal = function (_a) {
    var fundArchiveModalIsOpen = _a.fundArchiveModalIsOpen, toggleArchiveModal = _a.toggleArchiveModal, archiveFundHandler = _a.archiveFundHandler, t = _a.t;
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_bootstrap_1.Modal, { size: "sm", id: "archiveFundModal", show: fundArchiveModalIsOpen, onHide: toggleArchiveModal, backdrop: "static", keyboard: false, className: OrganizationFunds_module_css_1["default"].fundModal },
            react_1["default"].createElement(react_bootstrap_1.Modal.Header, { closeButton: true, className: "bg-primary" },
                react_1["default"].createElement(react_bootstrap_1.Modal.Title, { className: "text-white", id: "archiveFund" }, t('archiveFund'))),
            react_1["default"].createElement(react_bootstrap_1.Modal.Body, null, t('archiveFundMsg')),
            react_1["default"].createElement(react_bootstrap_1.Modal.Footer, null,
                react_1["default"].createElement(react_bootstrap_1.Button, { type: "button", className: "btn btn-danger", "data-dismiss": "modal", onClick: toggleArchiveModal, "data-testid": "fundArchiveModalCloseBtn" }, t('no')),
                react_1["default"].createElement(react_bootstrap_1.Button, { type: "button", className: "btn btn-success", onClick: archiveFundHandler, "data-testid": "fundArchiveModalArchiveBtn" }, t('yes'))))));
};
exports["default"] = FundArchiveModal;
