"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var currentOrg = window.location.href.split('=')[1];
var reducer = function (state, action) {
    if (state === void 0) { state = INITIAL_STATE; }
    switch (action.type) {
        case 'UPDATE_TARGETS': {
            return Object.assign({}, INITIAL_STATE, {
                targets: __spreadArrays(INITIAL_STATE.targets, [action.payload])
            });
        }
        case 'UPDATE_P_TARGETS': {
            var oldTargets = INITIAL_STATE.targets.filter(function (target) { return target.name === 'Plugins'; })[0].subTargets;
            return Object.assign({}, INITIAL_STATE, {
                targets: __spreadArrays(INITIAL_STATE.targets.filter(function (target) { return target.name !== 'Plugins'; }), [
                    Object.assign({}, {
                        name: 'Plugins',
                        comp_id: null,
                        component: null,
                        subTargets: __spreadArrays(action.payload, oldTargets)
                    }),
                ])
            });
        }
        default: {
            return state;
        }
    }
};
// Note: Routes with names appear on NavBar
var components = [
    { name: 'My Organizations', comp_id: 'orglist', component: 'OrgList' },
    { name: 'Dashboard', comp_id: 'orgdash', component: 'OrganizationDashboard' },
    { name: 'People', comp_id: 'orgpeople', component: 'OrganizationPeople' },
    { name: 'Events', comp_id: 'orgevents', component: 'OrganizationEvents' },
    {
        name: 'Action Items',
        comp_id: 'orgactionitems',
        component: 'OrganizationActionItems'
    },
    { name: 'Posts', comp_id: 'orgpost', component: 'OrgPost' },
    { name: 'Block/Unblock', comp_id: 'blockuser', component: 'BlockUser' },
    { name: 'Advertisement', comp_id: 'orgads', component: 'Advertisements' },
    { name: 'Funds', comp_id: 'orgfunds', component: 'OrganizationFunds' },
    {
        name: 'Plugins',
        comp_id: null,
        component: 'AddOnStore',
        subTargets: [
            {
                name: 'Plugin Store',
                comp_id: 'orgstore',
                component: 'AddOnStore',
                icon: 'fa-store'
            },
        ]
    },
    { name: 'Settings', comp_id: 'orgsetting', component: 'OrgSettings' },
    { name: '', comp_id: 'member', component: 'MemberDetail' },
];
var generateRoutes = function (comps) {
    return comps
        .filter(function (comp) { return comp.name && comp.name !== ''; })
        .map(function (comp) {
        var _a;
        var entry = comp.comp_id
            ? { name: comp.name, url: "/" + comp.comp_id + "/id=" + currentOrg }
            : {
                name: comp.name,
                subTargets: (_a = comp.subTargets) === null || _a === void 0 ? void 0 : _a.map(function (subTarget) {
                    return {
                        name: subTarget.name,
                        url: "/" + subTarget.comp_id + "/id=" + currentOrg,
                        icon: subTarget.icon ? subTarget.icon : null
                    };
                })
            };
        return entry;
    });
};
var INITIAL_STATE = {
    targets: generateRoutes(components),
    configUrl: "" + currentOrg,
    components: components
};
exports["default"] = reducer;
