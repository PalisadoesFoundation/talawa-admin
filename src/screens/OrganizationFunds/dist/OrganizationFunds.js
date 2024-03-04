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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/* eslint-disable */
var client_1 = require("@apollo/client");
var icons_material_1 = require("@mui/icons-material");
var FundMutation_1 = require("GraphQl/Mutations/FundMutation");
var OrganizationQueries_1 = require("GraphQl/Queries/OrganizationQueries");
var Loader_1 = require("components/Loader/Loader");
var OrganizationScreen_1 = require("components/OrganizationScreen/OrganizationScreen");
var react_1 = require("react");
var react_bootstrap_1 = require("react-bootstrap");
var react_i18next_1 = require("react-i18next");
var react_toastify_1 = require("react-toastify");
var FundArchiveModal_1 = require("./FundArchiveModal");
var FundCreateModal_1 = require("./FundCreateModal");
var FundDeleteModal_1 = require("./FundDeleteModal");
var FundUpdateModal_1 = require("./FundUpdateModal");
var OrganizationFunds_module_css_1 = require("./OrganizationFunds.module.css");
var organizationFunds = function () {
    var _a, _b;
    var t = react_i18next_1.useTranslation('translation', {
        keyPrefix: 'funds'
    }).t;
    var currentUrl = window.location.href.split('=')[1];
    var _c = react_1.useState(false), fundCreateModalIsOpen = _c[0], setFundCreateModalIsOpen = _c[1];
    var _d = react_1.useState(false), fundUpdateModalIsOpen = _d[0], setFundUpdateModalIsOpen = _d[1];
    var _e = react_1.useState(false), fundDeleteModalIsOpen = _e[0], setFundDeleteModalIsOpen = _e[1];
    var _f = react_1.useState(false), fundArchivedModalIsOpen = _f[0], setFundArchivedModalIsOpen = _f[1];
    var _g = react_1.useState(true), taxDeductible = _g[0], setTaxDeductible = _g[1];
    var _h = react_1.useState(false), isArchived = _h[0], setIsArchived = _h[1];
    var _j = react_1.useState(false), isDefault = _j[0], setIsDefault = _j[1];
    var _k = react_1.useState(null), fund = _k[0], setFund = _k[1];
    var _l = react_1.useState('Non-Archived'), fundType = _l[0], setFundType = _l[1];
    var _m = react_1.useState(false), click = _m[0], setClick = _m[1];
    var _o = react_1.useState(true), initialRender = _o[0], setInitialRender = _o[1];
    var _p = react_1.useState({
        fundName: '',
        fundRef: ''
    }), formState = _p[0], setFormState = _p[1];
    var _q = client_1.useQuery(OrganizationQueries_1.ORGANIZATION_FUNDS, {
        variables: {
            id: currentUrl
        }
    }), fundData = _q.data, fundLoading = _q.loading, fundError = _q.error, refetchFunds = _q.refetch;
    var createFund = client_1.useMutation(FundMutation_1.CREATE_FUND_MUTATION)[0];
    var updateFund = client_1.useMutation(FundMutation_1.UPDATE_FUND_MUTATION)[0];
    var deleteFund = client_1.useMutation(FundMutation_1.REMOVE_FUND_MUTATION)[0];
    var showCreateModal = function () {
        setFundCreateModalIsOpen(!fundCreateModalIsOpen);
    };
    var hideCreateModal = function () {
        setFundCreateModalIsOpen(!fundCreateModalIsOpen);
    };
    var showUpdateModal = function () {
        setFundUpdateModalIsOpen(!fundUpdateModalIsOpen);
    };
    var hideUpdateModal = function () {
        setFundUpdateModalIsOpen(!fundUpdateModalIsOpen);
    };
    var toggleDeleteModal = function () {
        setFundDeleteModalIsOpen(!fundDeleteModalIsOpen);
    };
    var toggleArchivedModal = function () {
        setFundArchivedModalIsOpen(!fundArchivedModalIsOpen);
    };
    var handleFundType = function (type) {
        setFundType(type);
    };
    var handleEditClick = function (fund) {
        setFormState({
            fundName: fund.name,
            fundRef: fund.refrenceNumber
        });
        setTaxDeductible(fund.taxDeductible);
        setIsArchived(fund.isArchived);
        setIsDefault(fund.isDefault);
        setFund(fund);
        showUpdateModal();
    };
    var createFundHandler = function (e) { return __awaiter(void 0, void 0, Promise, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, createFund({
                            variables: {
                                name: formState.fundName,
                                refrenceNumber: formState.fundRef,
                                organizationId: currentUrl,
                                taxDeductible: taxDeductible,
                                isArchived: isArchived,
                                isDefault: isDefault
                            }
                        })];
                case 2:
                    _a.sent();
                    setFormState({
                        fundName: '',
                        fundRef: ''
                    });
                    react_toastify_1.toast.success(t('fundCreated'));
                    refetchFunds();
                    hideCreateModal();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    react_toastify_1.toast.error(error_1.message);
                    console.log(error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var updateFundHandler = function (e) { return __awaiter(void 0, void 0, Promise, function () {
        var updatedFields, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    updatedFields = {};
                    if (formState.fundName != (fund === null || fund === void 0 ? void 0 : fund.name)) {
                        updatedFields.name = formState.fundName;
                    }
                    if (taxDeductible != (fund === null || fund === void 0 ? void 0 : fund.taxDeductible)) {
                        updatedFields.taxDeductible = taxDeductible;
                    }
                    if (isArchived != (fund === null || fund === void 0 ? void 0 : fund.isArchived)) {
                        updatedFields.isArchived = isArchived;
                    }
                    if (isDefault != (fund === null || fund === void 0 ? void 0 : fund.isDefault)) {
                        updatedFields.isDefault = isDefault;
                    }
                    return [4 /*yield*/, updateFund({
                            variables: __assign({ id: fund === null || fund === void 0 ? void 0 : fund._id }, updatedFields)
                        })];
                case 2:
                    _a.sent();
                    setFormState({
                        fundName: '',
                        fundRef: ''
                    });
                    refetchFunds();
                    hideUpdateModal();
                    react_toastify_1.toast.success(t('fundUpdated'));
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    react_toastify_1.toast.error(error_2.message);
                    console.log(error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var archiveFundHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('herere');
                    return [4 /*yield*/, updateFund({
                            variables: {
                                id: fund === null || fund === void 0 ? void 0 : fund._id,
                                isArchived: !(fund === null || fund === void 0 ? void 0 : fund.isArchived)
                            }
                        })];
                case 1:
                    _a.sent();
                    if (fundType == 'Non-Archived')
                        toggleArchivedModal();
                    refetchFunds();
                    (fund === null || fund === void 0 ? void 0 : fund.isArchived) ? react_toastify_1.toast.success(t('fundUnarchived'))
                        : react_toastify_1.toast.success(t('fundArchived'));
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    react_toastify_1.toast.error(error_3.message);
                    console.log(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var deleteFundHandler = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteFund({
                            variables: {
                                id: fund === null || fund === void 0 ? void 0 : fund._id
                            }
                        })];
                case 1:
                    _a.sent();
                    refetchFunds();
                    toggleDeleteModal();
                    react_toastify_1.toast.success(t('fundDeleted'));
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    react_toastify_1.toast.error(error_4.message);
                    console.log(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    //it is used to rerender the component to use updated Fund in setState
    react_1.useEffect(function () {
        //do not execute it on initial render
        if (!initialRender) {
            archiveFundHandler();
        }
        else {
            setInitialRender(false);
        }
    }, [click]);
    if (fundLoading) {
        return React.createElement(Loader_1["default"], { size: "xl" });
    }
    if (fundError) {
        return (React.createElement(OrganizationScreen_1["default"], { screenName: "OrganizationFunds", title: t('title') },
            React.createElement("div", { className: OrganizationFunds_module_css_1["default"].container + " bg-white rounded-4 my-3" },
                React.createElement("div", { className: OrganizationFunds_module_css_1["default"].message, "data-testid": "errorMsg" },
                    React.createElement(icons_material_1.WarningAmberRounded, { className: OrganizationFunds_module_css_1["default"].errorIcon, fontSize: "large" }),
                    React.createElement("h6", { className: "fw-bold text-danger text-center" },
                        "Error occured while loading Funds",
                        React.createElement("br", null),
                        fundError.message)))));
    }
    return (React.createElement("div", { className: OrganizationFunds_module_css_1["default"].organizationFundContainer },
        React.createElement(OrganizationScreen_1["default"], { screenName: "OrganizationFunds", title: t('title') },
            React.createElement(react_bootstrap_1.Button, { variant: "success", className: OrganizationFunds_module_css_1["default"].createFundButton, onClick: showCreateModal, "data-testid": "createFundBtn" },
                React.createElement("i", { className: 'fa fa-plus me-2' }),
                t('createFund')),
            React.createElement("div", { className: OrganizationFunds_module_css_1["default"].container + "  bg-white rounded-4 my-3" },
                React.createElement("div", { className: "mx-4 mt-4" },
                    React.createElement(react_bootstrap_1.Dropdown, { "aria-expanded": "false", "data-testid": "type", className: "d-flex mb-0" },
                        React.createElement(react_bootstrap_1.Dropdown.Toggle, { variant: "outline-success", "data-testid": "fundtype" }, fundType == 'Archived' ? 'Archived' : 'Non-Archived'),
                        React.createElement(react_bootstrap_1.Dropdown.Menu, null,
                            React.createElement(react_bootstrap_1.Dropdown.Item, { onClick: function () { return handleFundType('Archived'); }, "data-testid": "Archived" }, t('archived')),
                            React.createElement(react_bootstrap_1.Dropdown.Item, { onClick: function () { return handleFundType('Non-Archived'); }, "data-testid": "Non-Archived" }, t('nonArchive'))))),
                React.createElement("div", { className: "mx-1 my-4" },
                    React.createElement("div", { className: "mx-4 shadow-sm rounded-top-4" },
                        React.createElement(react_bootstrap_1.Row, { className: "mx-0 border border-light-subtle rounded-top-4 py-3 justify-content-between" },
                            React.createElement(react_bootstrap_1.Col, { xs: 7, sm: 4, md: 3, lg: 3, className: " fs-5 fw-bold" },
                                React.createElement("div", { className: "ms-2" }, t('fundName'))),
                            React.createElement(react_bootstrap_1.Col, { xs: 5, sm: 3, lg: 2, className: "fs-5 fw-bold" },
                                React.createElement("div", { className: "ms-3" }, t('fundOptions'))))),
                    React.createElement("div", { className: "mx-4 bg-light-subtle border border-light-subtle border-top-0 rounded-bottom-4 shadow-sm" }, (_a = fundData === null || fundData === void 0 ? void 0 : fundData.organizations[0].funds) === null || _a === void 0 ? void 0 :
                        _a.filter(function (fund) {
                            return fundType === 'Archived' ? fund.isArchived : !fund.isArchived;
                        }).map(function (fundd, index) {
                            var _a;
                            return (React.createElement("div", { key: index },
                                React.createElement(react_bootstrap_1.Row, { className: (index === 0 ? 'pt-3' : '') + " mb-3 ms-2 justify-content-between " },
                                    React.createElement(react_bootstrap_1.Col, { sm: 4, xs: 7, md: 3, lg: 3, className: "align-self-center fw-bold " + OrganizationFunds_module_css_1["default"].fundName },
                                        React.createElement("div", { className: "fw-bold cursor-pointer" }, fundd.name)),
                                    React.createElement(react_bootstrap_1.Col, { xs: 5, sm: 3, lg: 2, className: "p-0" },
                                        React.createElement(react_bootstrap_1.Button, { "data-testid": "archiveFundBtn", className: "btn btn-sm me-2", variant: "outline-secondary", onClick: function () { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    setFund(fundd);
                                                    if (fundType === 'Non-Archived') {
                                                        toggleArchivedModal();
                                                    }
                                                    else {
                                                        setClick(!click);
                                                    }
                                                    return [2 /*return*/];
                                                });
                                            }); } },
                                            React.createElement("i", { className: "" + (fundType == 'Archived' ? 'fa fa-undo' : 'fa fa-archive') })),
                                        fundType === 'Non-Archived' ? (React.createElement(react_bootstrap_1.Button, { size: "sm", "data-testid": "editFundBtn", onClick: function () { return handleEditClick(fundd); }, className: "me-2", variant: "success" },
                                            ' ',
                                            React.createElement("i", { className: "fas fa-edit" }))) : null,
                                        React.createElement(react_bootstrap_1.Button, { size: "sm", "data-testid": "deleteFundBtn", variant: "danger", onClick: function () {
                                                setFund(fundd);
                                                toggleDeleteModal();
                                            } },
                                            ' ',
                                            React.createElement("i", { className: "fa fa-trash" })))),
                                ((_a = fundData === null || fundData === void 0 ? void 0 : fundData.organizations[0]) === null || _a === void 0 ? void 0 : _a.funds) &&
                                    index !== fundData.organizations[0].funds.length - 1 && (React.createElement("hr", { className: "mx-3" }))));
                        }),
                        ((_b = fundData === null || fundData === void 0 ? void 0 : fundData.organizations[0].funds) === null || _b === void 0 ? void 0 : _b.length) === 0 && (React.createElement("div", { className: "lh-lg text-center fw-semibold text-body-tertiary" }, t('noFunds'))))))),
        React.createElement(FundCreateModal_1["default"], { fundCreateModalIsOpen: fundCreateModalIsOpen, hideCreateModal: hideCreateModal, formState: formState, setFormState: setFormState, createFundHandler: createFundHandler, taxDeductible: taxDeductible, setTaxDeductible: setTaxDeductible, isArchived: isArchived, setIsArchived: setIsArchived, isDefault: isDefault, setIsDefault: setIsDefault, t: t }),
        React.createElement(FundUpdateModal_1["default"], { fundUpdateModalIsOpen: fundUpdateModalIsOpen, hideUpdateModal: hideUpdateModal, formState: formState, setFormState: setFormState, updateFundHandler: updateFundHandler, taxDeductible: taxDeductible, setTaxDeductible: setTaxDeductible, isArchived: isArchived, setIsArchived: setIsArchived, isDefault: isDefault, setIsDefault: setIsDefault, t: t }),
        React.createElement(FundDeleteModal_1["default"], { fundDeleteModalIsOpen: fundDeleteModalIsOpen, deleteFundHandler: deleteFundHandler, toggleDeleteModal: toggleDeleteModal, t: t }),
        React.createElement(FundArchiveModal_1["default"], { fundArchiveModalIsOpen: fundArchivedModalIsOpen, archiveFundHandler: archiveFundHandler, toggleArchiveModal: toggleArchivedModal, t: t })));
};
exports["default"] = organizationFunds;
