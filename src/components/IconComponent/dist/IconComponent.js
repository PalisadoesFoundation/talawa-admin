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
var icons_material_1 = require("@mui/icons-material");
var actionItem_svg_1 = require("assets/svgs/actionItem.svg");
var blockUser_svg_1 = require("assets/svgs/blockUser.svg");
var checkInRegistrants_svg_1 = require("assets/svgs/checkInRegistrants.svg");
var dashboard_svg_1 = require("assets/svgs/dashboard.svg");
var eventStats_svg_1 = require("assets/svgs/eventStats.svg");
var events_svg_1 = require("assets/svgs/events.svg");
var funds_svg_1 = require("assets/svgs/funds.svg");
var listEventRegistrants_svg_1 = require("assets/svgs/listEventRegistrants.svg");
var organizations_svg_1 = require("assets/svgs/organizations.svg");
var people_svg_1 = require("assets/svgs/people.svg");
var plugins_svg_1 = require("assets/svgs/plugins.svg");
var posts_svg_1 = require("assets/svgs/posts.svg");
var settings_svg_1 = require("assets/svgs/settings.svg");
var react_1 = require("react");
var iconComponent = function (props) {
    switch (props.name) {
        case 'My Organizations':
            return (react_1["default"].createElement(organizations_svg_1.ReactComponent, { stroke: props.fill, "data-testid": "Icon-Component-MyOrganizationsIcon" }));
        case 'Dashboard':
            return (react_1["default"].createElement(dashboard_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Icon-Component-DashboardIcon" })));
        case 'People':
            return react_1["default"].createElement(people_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Icon-Component-PeopleIcon" }));
        case 'Events':
            return react_1["default"].createElement(events_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Icon-Component-EventsIcon" }));
        case 'Action Items':
            return (react_1["default"].createElement(actionItem_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Icon-Component-ActionItemIcon" })));
        case 'Posts':
            return react_1["default"].createElement(posts_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Icon-Component-PostsIcon" }));
        case 'Block/Unblock':
            return (react_1["default"].createElement(blockUser_svg_1.ReactComponent, __assign({}, props, { "data-testid": "Block/Icon-Component-UnblockIcon" })));
        case 'Plugins':
            return (react_1["default"].createElement(plugins_svg_1.ReactComponent, { stroke: props.fill, "data-testid": "Icon-Component-PluginsIcon" }));
        case 'Settings':
            return (react_1["default"].createElement(settings_svg_1.ReactComponent, { stroke: props.fill, "data-testid": "Icon-Component-SettingsIcon" }));
        case 'List Event Registrants':
            return (react_1["default"].createElement(listEventRegistrants_svg_1.ReactComponent, { "data-testid": "Icon-Component-List-Event-Registrants", stroke: props.fill }));
        case 'Check In Registrants':
            return (react_1["default"].createElement(checkInRegistrants_svg_1.ReactComponent, { "data-testid": "Icon-Component-Check-In-Registrants", stroke: props.fill }));
        case 'Event Stats':
            return (react_1["default"].createElement(eventStats_svg_1.ReactComponent, { "data-testid": "Icon-Component-Event-Stats", stroke: props.fill }));
        case 'Advertisement':
            return (react_1["default"].createElement(posts_svg_1.ReactComponent, { "data-testid": "Icon-Component-Advertisement", stroke: props.fill }));
        case 'Funds':
            return (react_1["default"].createElement(funds_svg_1.ReactComponent, { "data-testid": "Icon-Component-Funds", stroke: props.fill }));
        default:
            return (react_1["default"].createElement(icons_material_1.QuestionMarkOutlined, __assign({}, props, { "data-testid": "Icon-Component-DefaultIcon" })));
    }
};
exports["default"] = iconComponent;
