---
id: plugin-architecture
title: Plugin Architecture
sidebar_position: 1
---

# Plugin Architecture

Plugin Architecture provides talawa projects an ability to control latent [Talawa Mobile App](https://docs.talawa.io/docs/developers/talawa/talawa-introduction) features from the [Talawa Admin](https://docs.talawa.io/docs/developers/talawa-admin/talawa-admin-introduction) Web Portal.

<!-- The Talawa API detects the existence of the plugin and the Mobile App will display new capabilities. -->

## Plugin

A Plugin is a feature in Talawa Mobile App that is controlled by the Admins of that organization. By having the control admins can decide the accessibility of that feature for the organization members.

Programmatically the logic of this Plugin is stored in the mobile app but it's inaccessible to the users until the admin of the organization installs that plugin.

You first have to be register the Plugins from the `Plugin store` in order to install them from the Talawa Admin.

## High Level Overview of Plugin Architecture

Let's discuss the role of the different apps to make the plugin architecture work.

### Talawa Admin

Admin Provides `Plugin Store` where has the following functionalities:

- Ability to install or uninstall the plugins.
- Ability to Toggle list of installed and available plugins.
- Ability to Search the plugin using SearchBar (provided on the right) .

#### Example

![Plugin Store Sample Image](/img/docs/plugin/store.PNG)

### Talawa API

It is a nodeJS API that is used to interface with the database containing list of the plugins with their different attributes.

A sample Plugin Model can have the below properties.

```js
Plugin : {
    pluginName: String, // plugin name
    pluginCreatedBy: String, // name of the creator
    pluginDesc : String, // description
    pluginInstallStatus : Boolean, // TRUE if installed otherwise FALSE
    installedOrgs : [ID] // a list containing ID of the organization who have installed the plugin
}
```

### Talawa

Plugin in the mobile App are mainly focused for the features on the navbar.but other functionalities can also be implemented as plugins using the `TalawaPluginProvider` Flutter Widget.  
![Talawa Mobile App ](/img/docs/plugin/talawa.PNG)

## Plugin Store

## Installing and Uninstalling Plugins

The Following video showcases process of installing the plugin. We are uninstalling `Events` feature from the talawa app.

:::note

Admin portal and Talawa app must be of same organizations

:::

<iframe width="560" height="315" src="https://www.youtube.com/embed/dsbh03N9wYo" title="Talawa Admin Plugin Demo - 2023" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
