---
id: implementing-plugins-example
title: Plugin Examples
---

:::note
Pre-Requisites :

1. [Plugin Architecture ](./plugin-architecture.md)
2. [Implementing Plugins](./implementing-plugins.md)

:::

Previously we've seen an technical overview of how we can implement plugins for our features.

Now let's see how we can implement a Donation feature as plugin and seeing it in actions. But before that let's take a look at the donation code.

```js
            CustomListTile(
                key: homeModel!.keySPDonateUs,
                index: 2,
                type: TileType.option,
                option: Options(
                    icon: Icon(
                    Icons.monetization_on,
                    color: Theme.of(context)
                    .colorScheme
                    .primary,
                    size: 30,
                ),
                title: AppLocalizations.of(context)!
                .strictTranslate('Donate  Us'),
                subtitle: AppLocalizations.of(context)!
                    .strictTranslate(
                    'Help us to develop for you',
                    ),
                ),
                onTapOption: () => donate(context, model),
                )
```

To see the entire file go [here](https://github.com/Palisadoesfoundation/talawa/blob/2a14faa4363ca26426fb2f9a8b39082c08e6597b/lib/views/after_auth_screens/profile/profile_page.dart)

It is a simple list option that says " Donate Us " and upon clicking that you get dialog with text "Help us to develop for you" for doing the payment.

Now let's follow the steps.

## 1. Plugin Registration

- Go to the `Plugin Store` and click on the `Add New` button.
- Give the name as <strong> `Donation` </strong>
- You add your information for `Creator Name` and `Description` fields.
- Your plugin should be at visible the store.

let's wrap our widget with the `TalawaPluginProvider` widget as it comes in the type `B` of plugin

## 2. Plugin Creation

- Wrap the donation code with the `TalawaPluginProvider` widget as a `child` property.
- Add <strong> `Donation` </strong> to `pluginName` property.

This is how the code will look like

```js
    TalawaPluginProvider(
         pluginName: "Donation",
         visible: true,
         child: Column(
            children: [
            CustomListTile(
                key: homeModel!.keySPDonateUs,
                index: 2,
                type: TileType.option,
                option: Options(
                icon: Icon(
                Icons.monetization_on,
                color: Theme.of(context)
                .colorScheme
                .primary,
                size: 30,
            ),
         title: AppLocalizations.of(context)!
         .strictTranslate('Donate  Us'),
         subtitle: AppLocalizations.of(context)!
         .strictTranslate(
         'Help us to develop for you',
                        ),
                    ),
         onTapOption: () => donate(context, model),
               ),
            ],
         ),
    )

```

---

Congrats! you've successfully converted your feature to a plugin. Now you can  install/uninstall  `Donation`  plugin from the  `Plugin Store`  of the  [Talawa Admin](https://github.com/PalisadoesFoundation/talawa-admin) to see the plugin UI becoming visible if it's installed for that organization otherwise hidden.

For development purposes to see the plugin even if it's uninstalled you can set the `serverVisible` property to `true`
