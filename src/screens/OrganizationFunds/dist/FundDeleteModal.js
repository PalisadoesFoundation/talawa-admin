"use strict";
exports.__esModule = true;
/*eslint-disable */
var react_bootstrap_1 = require("react-bootstrap");
var OrganizationFunds_module_css_1 = require("./OrganizationFunds.module.css");
var FundDeleteModal = function (_a) {
    var fundDeleteModalIsOpen = _a.fundDeleteModalIsOpen, deleteFundHandler = _a.deleteFundHandler, toggleDeleteModal = _a.toggleDeleteModal, t = _a.t;
    return (React.createElement(React.Fragment, null,
        React.createElement(react_bootstrap_1.Modal, { size: "sm", id: "deleteFundModal", show: fundDeleteModalIsOpen, onHide: toggleDeleteModal, backdrop: "static", keyboard: false, className: OrganizationFunds_module_css_1["default"].fundModal },
            React.createElement(react_bootstrap_1.Modal.Header, { closeButton: true, className: "bg-primary" },
                React.createElement(react_bootstrap_1.Modal.Title, { className: "text-white", id: "deleteFund" }, t('fundDelete'))),
            React.createElement(react_bootstrap_1.Modal.Body, null,
                t('deleteFundMsg'),
                " "),
            React.createElement(react_bootstrap_1.Modal.Footer, null,
                React.createElement(react_bootstrap_1.Button, { type: "button", className: "btn btn-danger", "data-dismiss": "modal", onClick: toggleDeleteModal, "data-testid": "fundDeleteModalCloseBtn" }, t('no')),
                React.createElement(react_bootstrap_1.Button, { type: "button", className: "btn btn-success", onClick: deleteFundHandler, "data-testid": "fundDeleteModalDeleteBtn" }, t('yes'))))));
};
exports["default"] = FundDeleteModal;
