---
id: implementing-plugins
title: Plugin Implementation
sidebar_position: 2
---

Plugins are existing features that are wrapped with some special logic or widgets to make them controllable.

Plugin are activated from Plugin store of the Admin panel

To implement features as plugins or to convert existing features into plugins, follow the below steps

## Technical Overview of the Steps to Implement features as plugins

### 1. Plugin Registration

- Plugins have to be registered first before even they are created from the Plugin store in the `Talawa Admin` portal. This can be done by developer by creating an account in the admin portal and going to `Plugin Store`.
- Plugin Store can be accessed from navbar

![Plugin Store Option in Navbar](/img/docs/plugin/plugin-store-navbar.PNG)

- Once entered in store , you will see a list of available plugins

![Plugin Store Sample Image](/img/docs/plugin/store.PNG)

- Click on the `Add New` Button
- Enter the Details of the New Plugin and Click on `Create`.

:::caution

The `Name` of plugin provided is very important and will be used for later steps.
Make sure to use unique names with trailing spaces.

:::

In next step we'll see how to create plugins

### 2. Plugin Creation

Based on where the feature UI is there are currently 2 ways to implement your features as plugins. Let's call them type A and B features for now.

![Plugin Store Option in Navbar](/img/docs/plugin/plugin-types.PNG)

#### A. Feature that are located in the bottom navigation bar

- For the features in the navbar we have maintained a list of them in [main_scree.dart](https://github.com/PalisadoesFoundation/talawa/blob/develop/lib/views/main_screen.dart) file.It has detailed comments to help you understand the operations.

- `renderBottomNavBarPlugins` method combines current features and plugins in navbar and generates an array containing `navBarItems` and `navbarClasses` and then it is returned to `children` property of the navbar UI code.
- Let's understand some important variables before understanding the process of conversion.

:::caution

The `Name` of property provided to any of the below variables should the exactly same for that feature only without any trailing spaces. Duplicate or Existing plugin names shouldn't be used keep the application consistent and predictable.

:::

1. `navBarItems`
   - Type `[ BottomNavigationBarItem() ]`
   - contains list of `BottomNavigationBarItem` widget to show `icon` and `text` to the navbar options.
   - if your feature is not a plugin it should be added to this array.
2. `navBarClasses`
   - Type `[Widgets]`
   - Array that contains the Widgets to be rendered on the navbar
3. `navNameClasses`
   - Type ` Map<dynamic, dynamic>`
   - Maps the feature names with their proper Icons and Widgets (named as `class`) used in navbar.
4. `navNameIcon`
   - Type `Map<String, Widgets>`
   - Contains a key value pair of the feature name in the navbar and it's corresponding plugin.

#### B. Other Features

- `TalawaPluginProvider` is Flutter widget that is used here . The Source can be viewed [here](https://github.com/PalisadoesFoundation/talawa/blob/develop/lib/plugins/talawa_plugin_provider.dart)
- Here's the basic use of `TalawaPluginProvider` with `Text()` widget.Let's discuss it's properties

```js
    const TalawaPluginProvider(child: Text("Demo") ,
        visible: true,
        pluginName: "My Plugin"
    );
```

1. `child`

   - Type `Widget?`
   - It can be any flutter UI widget like `Container()`, `Text()`, `Row()`,etc. For example if your features is encapsulated within an `Container()` widget then wrap that widget into the `TalawaPluginProvider` .

2. `visible`

   - Type `Boolean`
   - True if plugin is Installed and plugin will be visible, Otherwise false hence plugin is hidden.

3. `pluginName`
   - Type `String`
   - Contains the name of the plugin. Make sure that the name provided here should match with the plugin name registered on the store from the
     [Step 1 A ](#a-feature-that-are-located-in-the-bottom-navigation-bar)
   - For example. If plugin stored on the store as `Members List` then here exactly enter `Members List` without any trialing spaces.

<u>

#### Additional properties : [For Development Purpose Only]

</u>

4. `serverVisible`

   - Type `Boolean`
   - True will make all plugins visible if set to `true` otherwise `false` won't change anything.
   - This property is accessible for the developers only as it can be only set during development phase. We can see that it is defined in build method of the widget.

   ```js
        Widget build(BuildContext context) {
           var serverVisible = false;
           serverVisible = checkFromPluginList();
           return serverVisible || visible ? child! : Container();
       }
   ```
