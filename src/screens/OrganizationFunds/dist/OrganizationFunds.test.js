"use strict";
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
var _a;
exports.__esModule = true;
var testing_1 = require("@apollo/client/testing");
var react_1 = require("@testing-library/react");
var react_2 = require("react");
var user_event_1 = require("@testing-library/user-event");
var react_i18next_1 = require("react-i18next");
var react_redux_1 = require("react-redux");
var react_router_dom_1 = require("react-router-dom");
var react_toastify_1 = require("react-toastify");
var store_1 = require("state/store");
var StaticMockLink_1 = require("utils/StaticMockLink");
var i18nForTest_1 = require("utils/i18nForTest");
var OrganizationFunds_1 = require("./OrganizationFunds");
var OrganizationFundsMocks_1 = require("./OrganizationFundsMocks");
jest.mock('react-toastify', function () { return ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}); });
function wait(ms) {
    if (ms === void 0) { ms = 100; }
    return __awaiter(this, void 0, Promise, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, react_1.act(function () {
                        return new Promise(function (resolve) {
                            setTimeout(resolve, ms);
                        });
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
var link1 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS, true);
var link2 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_ORGANIZATIONS_FUNDS, true);
var link3 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_CREATE_FUND, true);
var link4 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_UPDATE_FUND, true);
var link5 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_REMOVE_FUND, true);
var link6 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ARCHIVED_FUND, true);
var link7 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_ARCHIVED_FUND, true);
var link8 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_UNARCHIVED_FUND, true);
var link9 = new StaticMockLink_1.StaticMockLink(OrganizationFundsMocks_1.MOCKS_ERROR_UNARCHIVED_FUND, true);
var translations = JSON.parse(JSON.stringify((_a = i18nForTest_1["default"].getDataByLanguage('en')) === null || _a === void 0 ? void 0 : _a.translation.funds));
describe('Testing OrganizationFunds screen', function () {
    var formData = {
        fundName: 'Test Fund',
        fundRef: '1'
    };
    it("loads the OrganizationFunds screen and it's components", function () { return __awaiter(void 0, void 0, void 0, function () {
        var getByText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    getByText = react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null)))))).getByText;
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(getByText(translations.createFund)).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("renders the OrganizationFunds screen and it's components with error", function () { return __awaiter(void 0, void 0, void 0, function () {
        var queryByText;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryByText = react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link2 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null)))))).queryByText;
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(queryByText(translations.createFund)).not.toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('renders the Error component', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link2 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('errorMsg')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('renders the funds component based on fund type', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundtype'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('Archived')).toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('Archived'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toHaveTextContent(translations.archived);
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toBeInTheDocument();
                        })];
                case 5:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundtype'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('Non-Archived')).toBeInTheDocument();
                        })];
                case 6:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('Non-Archived'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toHaveTextContent(translations.nonArchive);
                        })];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("opens and closes the 'Create Fund' modal", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('createFundBtn')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('createFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundModalCloseBtn'));
                    return [4 /*yield*/, react_1.waitForElementToBeRemoved(function () {
                            return react_1.screen.queryByTestId('createFundModalCloseBtn');
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('creates a new fund', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('createFundBtn')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('createFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundName), formData.fundName);
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundId), formData.fundRef);
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundFormSubmitBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.success).toBeCalledWith(translations.fundCreated);
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toast error on unsuccessful fund creation', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link3 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('createFundBtn')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('createFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundName), formData.fundName);
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundId), formData.fundRef);
                    user_event_1["default"].click(react_1.screen.getByTestId('createFundFormSubmitBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.error).toHaveBeenCalled();
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("opens and closes the 'Edit Fund' modal", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('editFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('editFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('editFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('editFundModalCloseBtn'));
                    return [4 /*yield*/, react_1.waitForElementToBeRemoved(function () {
                            return react_1.screen.queryByTestId('editFundModalCloseBtn');
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('updates a fund', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('editFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('editFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('editFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundName), 'Test Fund Updated');
                    user_event_1["default"].click(react_1.screen.getByTestId('editFundFormSubmitBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.success).toBeCalledWith(translations.fundUpdated);
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toast error on unsuccessful fund update', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link4 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('editFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('editFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('editFundModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].type(react_1.screen.getByPlaceholderText(translations.enterfundName), 'Test Fund Updated');
                    user_event_1["default"].click(react_1.screen.getByTestId('editFundFormSubmitBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.error).toHaveBeenCalled();
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("opens and closes the 'Delete Fund' modal", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('deleteFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundDeleteModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundDeleteModalCloseBtn'));
                    return [4 /*yield*/, react_1.waitForElementToBeRemoved(function () {
                            return react_1.screen.queryByTestId('fundDeleteModalCloseBtn');
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('deletes a fund', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('deleteFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundDeleteModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundDeleteModalDeleteBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.success).toBeCalledWith(translations.fundDeleted);
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toast error on unsuccessful fund deletion', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link5 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('deleteFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('deleteFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundDeleteModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundDeleteModalDeleteBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.error).toHaveBeenCalled();
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it("opens and closes the 'Archive Fund' modal", function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link1 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('archiveFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundArchiveModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundArchiveModalCloseBtn'));
                    return [4 /*yield*/, react_1.waitForElementToBeRemoved(function () {
                            return react_1.screen.queryByTestId('fundArchiveModalCloseBtn');
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('archive the fund', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link6 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('archiveFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundArchiveModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundArchiveModalArchiveBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.success).toBeCalledWith(translations.fundArchived);
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toast error on unsuccessful fund archive', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link7 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('archiveFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            return expect(react_1.screen.findByTestId('fundArchiveModalCloseBtn')).resolves.toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundArchiveModalArchiveBtn'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.error).toHaveBeenCalled();
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('unarchives the fund', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link8 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundtype'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('Archived')).toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('Archived'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toHaveTextContent(translations.archived);
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
                        })];
                case 5:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('archiveFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.success).toBeCalledWith(translations.fundUnarchived);
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('toast error on unsuccessful fund unarchive', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    react_1.render(react_2["default"].createElement(testing_1.MockedProvider, { addTypename: false, link: link9 },
                        react_2["default"].createElement(react_redux_1.Provider, { store: store_1.store },
                            react_2["default"].createElement(react_router_dom_1.BrowserRouter, null,
                                react_2["default"].createElement(react_i18next_1.I18nextProvider, { i18n: i18nForTest_1["default"] }, react_2["default"].createElement(OrganizationFunds_1["default"], null))))));
                    return [4 /*yield*/, wait()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toBeInTheDocument();
                        })];
                case 2:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('fundtype'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('Archived')).toBeInTheDocument();
                        })];
                case 3:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getByTestId('Archived'));
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getByTestId('fundtype')).toHaveTextContent(translations.archived);
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_1.screen.getAllByTestId('archiveFundBtn')[0]).toBeInTheDocument();
                        })];
                case 5:
                    _a.sent();
                    user_event_1["default"].click(react_1.screen.getAllByTestId('archiveFundBtn')[0]);
                    return [4 /*yield*/, react_1.waitFor(function () {
                            expect(react_toastify_1.toast.error).toHaveBeenCalled();
                        })];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
