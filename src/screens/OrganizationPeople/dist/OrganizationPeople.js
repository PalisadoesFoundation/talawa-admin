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
var client_1 = require("@apollo/client");
var dayjs_1 = require("dayjs");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var react_bootstrap_1 = require("react-bootstrap");
var Col_1 = require("react-bootstrap/Col");
var Row_1 = require("react-bootstrap/Row");
var Queries_1 = require("GraphQl/Queries/Queries");
var NotFound_1 = require("components/NotFound/NotFound");
var OrganizationScreen_1 = require("components/OrganizationScreen/OrganizationScreen");
var react_i18next_1 = require("react-i18next");
var OrganizationPeople_module_css_1 = require("./OrganizationPeople.module.css");
var react_toastify_1 = require("react-toastify");
var icons_material_1 = require("@mui/icons-material");
var Table_1 = require("@mui/material/Table");
var TableBody_1 = require("@mui/material/TableBody");
var TableCell_1 = require("@mui/material/TableCell");
var TableContainer_1 = require("@mui/material/TableContainer");
var TableHead_1 = require("@mui/material/TableHead");
var TableRow_1 = require("@mui/material/TableRow");
var Paper_1 = require("@mui/material/Paper");
var styles_1 = require("@mui/material/styles");
var Loader_1 = require("components/Loader/Loader");
var UserListCard_1 = require("components/UserListCard/UserListCard");
var OrgPeopleListCard_1 = require("components/OrgPeopleListCard/OrgPeopleListCard");
var OrgAdminListCard_1 = require("components/OrgAdminListCard/OrgAdminListCard");
var StyledTableCell = styles_1.styled(TableCell_1["default"])(function (_a) {
    var _b;
    var theme = _a.theme;
    return (_b = {},
        _b["&." + TableCell_1.tableCellClasses.head] = {
            backgroundColor: ['#31bb6b', '!important'],
            color: theme.palette.common.white
        },
        _b["&." + TableCell_1.tableCellClasses.body] = {
            fontSize: 14
        },
        _b);
});
var StyledTableRow = styles_1.styled(TableRow_1["default"])(function () { return ({
    '&:last-child td, &:last-child th': {
        border: 0
    }
}); });
function organizationPeople() {
    var _a;
    var t = react_i18next_1.useTranslation('translation', {
        keyPrefix: 'organizationPeople'
    }).t;
    document.title = t('title');
    var location = react_router_dom_1.useLocation();
    var role = location === null || location === void 0 ? void 0 : location.state;
    var currentUrl = window.location.href.split('=')[1];
    var _b = react_1.useState((role === null || role === void 0 ? void 0 : role.role) || 0), state = _b[0], setState = _b[1];
    var _c = react_1.useState({
        firstName_contains: '',
        lastName_contains: ''
    }), filterData = _c[0], setFilterData = _c[1];
    var _d = react_1.useState(''), fullName = _d[0], setFullName = _d[1];
    var _e = client_1.useLazyQuery(Queries_1.ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
        variables: {
            firstName_contains: '',
            lastName_contains: '',
            orgId: currentUrl
        }
    })[1], memberData = _e.data, memberLoading = _e.loading, memberError = _e.error, memberRefetch = _e.refetch;
    var _f = client_1.useLazyQuery(Queries_1.ORGANIZATIONS_MEMBER_CONNECTION_LIST, {
        variables: {
            firstName_contains: '',
            lastName_contains: '',
            orgId: currentUrl,
            admin_for: currentUrl
        }
    })[1], adminData = _f.data, adminLoading = _f.loading, adminError = _f.error, adminRefetch = _f.refetch;
    var _g = client_1.useLazyQuery(Queries_1.USER_LIST, {
        variables: {
            firstName_contains: '',
            lastName_contains: ''
        }
    })[1], usersData = _g.data, usersLoading = _g.loading, usersError = _g.error, usersRefetch = _g.refetch;
    react_1.useEffect(function () {
        if (state === 0) {
            memberRefetch(__assign(__assign({}, filterData), { orgId: currentUrl }));
        }
        else if (state === 1) {
            adminRefetch(__assign(__assign({}, filterData), { orgId: currentUrl, admin_for: currentUrl }));
        }
        else {
            usersRefetch(__assign({}, filterData));
        }
    }, [state]);
    /* istanbul ignore next */
    if (memberError || usersError || adminError) {
        var error = (_a = memberError !== null && memberError !== void 0 ? memberError : usersError) !== null && _a !== void 0 ? _a : adminError;
        react_toastify_1.toast.error(error === null || error === void 0 ? void 0 : error.message);
    }
    var handleFullNameSearchChange = function (e) {
        /* istanbul ignore next */
        if (e.key === 'Enter') {
            var _a = fullName.split(' '), firstName = _a[0], lastName = _a[1];
            var newFilterData = {
                firstName_contains: firstName !== null && firstName !== void 0 ? firstName : '',
                lastName_contains: lastName !== null && lastName !== void 0 ? lastName : ''
            };
            setFilterData(newFilterData);
            if (state === 0) {
                memberRefetch(__assign(__assign({}, newFilterData), { orgId: currentUrl }));
            }
            else if (state === 1) {
                adminRefetch(__assign(__assign({}, newFilterData), { orgId: currentUrl, admin_for: currentUrl }));
            }
            else {
                usersRefetch(__assign({}, newFilterData));
            }
        }
    };
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(OrganizationScreen_1["default"], { screenName: "People", title: t('people') },
            react_1["default"].createElement(Row_1["default"], { className: OrganizationPeople_module_css_1["default"].head },
                react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].mainpageright },
                    react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].btnsContainer },
                        react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].input },
                            react_1["default"].createElement(react_bootstrap_1.Form.Control, { type: "name", id: "searchLastName", placeholder: t('searchFullName'), autoComplete: "off", required: true, className: OrganizationPeople_module_css_1["default"].inputField, value: fullName, onChange: function (e) {
                                    var value = e.target.value;
                                    setFullName(value);
                                    handleFullNameSearchChange(value);
                                }, onKeyUp: handleFullNameSearchChange }),
                            react_1["default"].createElement(react_bootstrap_1.Button, { className: "position-absolute z-10 bottom-0 end-0  d-flex justify-content-center align-items-center ", onClick: handleFullNameSearchChange, style: { marginBottom: '10px' } },
                                react_1["default"].createElement(icons_material_1.Search, null))),
                        react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].btnsBlock },
                            react_1["default"].createElement(react_bootstrap_1.Dropdown, null,
                                react_1["default"].createElement(react_bootstrap_1.Dropdown.Toggle, { variant: "success", id: "dropdown-basic", className: OrganizationPeople_module_css_1["default"].dropdown, "data-testid": "role" },
                                    react_1["default"].createElement(icons_material_1.Sort, null),
                                    t('sort')),
                                react_1["default"].createElement(react_bootstrap_1.Dropdown.Menu, null,
                                    react_1["default"].createElement(react_bootstrap_1.Dropdown.Item, { inline: true, id: "userslist", value: "userslist", name: "displaylist", "data-testid": "users", defaultChecked: state == 2 ? true : false, onClick: function () {
                                            setState(2);
                                        } },
                                        react_1["default"].createElement(react_bootstrap_1.Form.Label, { htmlFor: "userslist" }, t('users'))),
                                    react_1["default"].createElement(react_bootstrap_1.Dropdown.Item, { inline: true, id: "memberslist", value: "memberslist", name: "displaylist", "data-testid": "members", defaultChecked: state == 0 ? true : false, onClick: function () {
                                            setState(0);
                                        } },
                                        react_1["default"].createElement("label", { htmlFor: "memberslist" }, t('members'))),
                                    react_1["default"].createElement(react_bootstrap_1.Dropdown.Item, { inline: true, id: "adminslist", value: "adminslist", name: "displaylist", "data-testid": "admins", defaultChecked: state == 1 ? true : false, onClick: function () {
                                            setState(1);
                                        } },
                                        react_1["default"].createElement("label", { htmlFor: "adminslist" }, t('admins'))))))))),
            react_1["default"].createElement(Col_1["default"], { sm: 9 },
                react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].mainpageright }, memberLoading || usersLoading || adminLoading ? (react_1["default"].createElement(react_1["default"].Fragment, null,
                    react_1["default"].createElement(Loader_1["default"], null))) : (
                /* istanbul ignore next */
                react_1["default"].createElement("div", { className: OrganizationPeople_module_css_1["default"].list_box, "data-testid": "orgpeoplelist" },
                    react_1["default"].createElement(Col_1["default"], { sm: 5 },
                        react_1["default"].createElement(TableContainer_1["default"], { component: Paper_1["default"], sx: { minWidth: '820px' } },
                            react_1["default"].createElement(Table_1["default"], { "aria-label": "customized table" },
                                react_1["default"].createElement(TableHead_1["default"], null,
                                    react_1["default"].createElement(TableRow_1["default"], null,
                                        react_1["default"].createElement(StyledTableCell, null, "#"),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, "Profile"),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, "Name"),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, "Email"),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, "Joined"),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, "Actions"))),
                                react_1["default"].createElement(TableBody_1["default"], null, 
                                /* istanbul ignore next */
                                state === 0 &&
                                    memberData &&
                                    memberData.organizationsMemberConnection.edges
                                        .length > 0 ? (memberData.organizationsMemberConnection.edges.map(function (datas, index) { return (react_1["default"].createElement(StyledTableRow, { key: datas._id },
                                    react_1["default"].createElement(StyledTableCell, { component: "th", scope: "row" }, index + 1),
                                    react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.image ? (react_1["default"].createElement("img", { src: datas.image, alt: "memberImage", className: "TableImage" })) : (react_1["default"].createElement("img", { src: "/images/svg/profiledefault.svg", alt: "memberImage", className: "TableImage" }))),
                                    react_1["default"].createElement(StyledTableCell, { align: "center" },
                                        react_1["default"].createElement(react_router_dom_1.Link, { className: OrganizationPeople_module_css_1["default"].membername, to: {
                                                pathname: "/member/id=" + currentUrl,
                                                state: { id: datas._id }
                                            } }, datas.firstName + ' ' + datas.lastName)),
                                    react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.email),
                                    react_1["default"].createElement(StyledTableCell, { align: "center" }, dayjs_1["default"](datas.createdAt).format('DD/MM/YYYY')),
                                    react_1["default"].createElement(StyledTableCell, { align: "center" },
                                        react_1["default"].createElement(OrgPeopleListCard_1["default"], { key: index, id: datas._id })))); })) : /* istanbul ignore next */
                                    state === 1 &&
                                        adminData &&
                                        adminData.organizationsMemberConnection.edges
                                            .length > 0 ? (adminData.organizationsMemberConnection.edges.map(function (datas, index) { return (react_1["default"].createElement(StyledTableRow, { key: datas._id },
                                        react_1["default"].createElement(StyledTableCell, { component: "th", scope: "row" }, index + 1),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.image ? (react_1["default"].createElement("img", { src: datas.image, alt: "memberImage", className: "TableImage" })) : (react_1["default"].createElement("img", { src: "/images/svg/profiledefault.svg", alt: "memberImage", className: "TableImage" }))),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" },
                                            react_1["default"].createElement(react_router_dom_1.Link, { className: OrganizationPeople_module_css_1["default"].membername, to: {
                                                    pathname: "/member/id=" + currentUrl,
                                                    state: { id: datas._id }
                                                } }, datas.firstName + ' ' + datas.lastName)),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.email),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, dayjs_1["default"](datas.createdAt).format('DD/MM/YYYY')),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" },
                                            react_1["default"].createElement(OrgAdminListCard_1["default"], { key: index, id: datas._id })))); })) : state === 2 &&
                                        usersData &&
                                        usersData.users.length > 0 ? (usersData.users.map(function (datas, index) { return (react_1["default"].createElement(StyledTableRow, { key: datas._id },
                                        react_1["default"].createElement(StyledTableCell, { component: "th", scope: "row" }, index + 1),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.image ? (react_1["default"].createElement("img", { src: datas.image, alt: "memberImage", className: "TableImage" })) : (react_1["default"].createElement("img", { src: "/images/svg/profiledefault.svg", alt: "memberImage", className: "TableImage" }))),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" },
                                            react_1["default"].createElement(react_router_dom_1.Link, { className: OrganizationPeople_module_css_1["default"].membername, to: {
                                                    pathname: "/member/id=" + currentUrl,
                                                    state: { id: datas._id }
                                                } }, datas.firstName + ' ' + datas.lastName)),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, datas.email),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" }, dayjs_1["default"](datas.createdAt).format('DD/MM/YYYY')),
                                        react_1["default"].createElement(StyledTableCell, { align: "center" },
                                            react_1["default"].createElement(UserListCard_1["default"], { key: index, id: datas._id })))); })) : (
                                    /* istanbul ignore next */
                                    react_1["default"].createElement(NotFound_1["default"], { title: state === 0
                                            ? 'member'
                                            : state === 1
                                                ? 'admin'
                                                : 'user', keyPrefix: "userNotFound" })))))))))))));
}
exports["default"] = organizationPeople;
