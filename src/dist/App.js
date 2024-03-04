"use strict";
exports.__esModule = true;
/* eslint-disable */
var client_1 = require("@apollo/client");
var Queries_1 = require("GraphQl/Queries/Queries");
var AddOnStore_1 = require("components/AddOn/core/AddOnStore/AddOnStore");
var Loader_1 = require("components/Loader/Loader");
var SecuredRoute_1 = require("components/SecuredRoute/SecuredRoute");
var SecuredRouteForUser_1 = require("components/UserPortal/SecuredRouteForUser/SecuredRouteForUser");
var installedPlugins = require("components/plugins/index");
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var BlockUser_1 = require("screens/BlockUser/BlockUser");
var EventDashboard_1 = require("screens/EventDashboard/EventDashboard");
var ForgotPassword_1 = require("screens/ForgotPassword/ForgotPassword");
var LoginPage_1 = require("screens/LoginPage/LoginPage");
var MemberDetail_1 = require("screens/MemberDetail/MemberDetail");
var OrgContribution_1 = require("screens/OrgContribution/OrgContribution");
var OrgList_1 = require("screens/OrgList/OrgList");
var OrgPost_1 = require("screens/OrgPost/OrgPost");
var OrgSettings_1 = require("screens/OrgSettings/OrgSettings");
var OrganizationActionItems_1 = require("screens/OrganizationActionItems/OrganizationActionItems");
var OrganizationDashboard_1 = require("screens/OrganizationDashboard/OrganizationDashboard");
var OrganizationEvents_1 = require("screens/OrganizationEvents/OrganizationEvents");
var OrganizationFunds_1 = require("screens/OrganizationFunds/OrganizationFunds");
var OrganizationPeople_1 = require("screens/OrganizationPeople/OrganizationPeople");
var PageNotFound_1 = require("screens/PageNotFound/PageNotFound");
var Users_1 = require("screens/Users/Users");
// User Portal Components
var Donate_1 = require("screens/UserPortal/Donate/Donate");
var Events_1 = require("screens/UserPortal/Events/Events");
var Home_1 = require("screens/UserPortal/Home/Home");
var Organizations_1 = require("screens/UserPortal/Organizations/Organizations");
var People_1 = require("screens/UserPortal/People/People");
var Settings_1 = require("screens/UserPortal/Settings/Settings");
// import UserLoginPage from 'screens/UserPortal/UserLoginPage/UserLoginPage';
// import Chat from 'screens/UserPortal/Chat/Chat';
var Advertisements_1 = require("components/Advertisements/Advertisements");
var useLocalstorage_1 = require("utils/useLocalstorage");
var setItem = useLocalstorage_1["default"]().setItem;
function app() {
    /*const { updatePluginLinks, updateInstalled } = bindActionCreators(
      actionCreators,
      dispatch
    );
  
    const getInstalledPlugins = async () => {
      const plugins = await fetchInstalled();
      updateInstalled(plugins);
      updatePluginLinks(new PluginHelper().generateLinks(plugins));
    };
  
    const fetchInstalled = async () => {
      const result = await fetch(`http://localhost:3005/installed`);
      return await result.json();
    };
  
    useEffect(() => {
      getInstalledPlugins();
    }, []);*/
    // const appRoutes = useSelector((state: RootState) => state.appRoutes);
    // const { components } = appRoutes;
    // TODO: Fetch Installed plugin extras and store for use within MainContent and Side Panel Components.
    var _a = client_1.useQuery(Queries_1.CHECK_AUTH), data = _a.data, loading = _a.loading;
    react_1.useEffect(function () {
        if (data) {
            setItem('name', data.checkAuth.firstName + " " + data.checkAuth.lastName);
            setItem('id', data.checkAuth._id);
            setItem('email', data.checkAuth.email);
            setItem('IsLoggedIn', 'TRUE');
            setItem('UserType', data.checkAuth.userType);
            setItem('FirstName', data.checkAuth.firstName);
            setItem('LastName', data.checkAuth.lastName);
            setItem('UserImage', data.checkAuth.image);
            setItem('Email', data.checkAuth.email);
        }
    }, [data, loading]);
    var extraRoutes = Object.entries(installedPlugins).map(function (plugin, index) {
        var extraComponent = plugin[1];
        return (react_1["default"].createElement(SecuredRoute_1["default"], { key: index, path: "/plugin/" + plugin[0].toLowerCase(), component: extraComponent }));
    });
    if (loading) {
        return react_1["default"].createElement(Loader_1["default"], null);
    }
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement(react_router_dom_1.Switch, null,
            react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: "/", component: LoginPage_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgdash", component: OrganizationDashboard_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgpeople", component: OrganizationPeople_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orglist", component: OrgList_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/member", component: MemberDetail_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgevents", component: OrganizationEvents_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgactionitems", component: OrganizationActionItems_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgfunds", component: OrganizationFunds_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgcontribution", component: OrgContribution_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgpost", component: OrgPost_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgsetting", component: OrgSettings_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgstore", component: AddOnStore_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/orgads", component: Advertisements_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/users", component: Users_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/blockuser", component: BlockUser_1["default"] }),
            react_1["default"].createElement(SecuredRoute_1["default"], { path: "/event/:eventId", component: EventDashboard_1["default"] }),
            extraRoutes,
            react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: "/forgotPassword", component: ForgotPassword_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/organizations", component: Organizations_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/organization", component: Home_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/people", component: People_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/settings", component: Settings_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/donate", component: Donate_1["default"] }),
            react_1["default"].createElement(SecuredRouteForUser_1["default"], { path: "/user/events", component: Events_1["default"] }),
            react_1["default"].createElement(react_router_dom_1.Route, { exact: true, path: "*", component: PageNotFound_1["default"] }))));
}
exports["default"] = app;
