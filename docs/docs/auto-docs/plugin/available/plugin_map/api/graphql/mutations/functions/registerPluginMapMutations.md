[Admin Docs](/)

***

# Function: registerPluginMapMutations()

> **registerPluginMapMutations**(`builderInstance`): `void`

Defined in: src/plugin/available/plugin\_map/api/graphql/mutations.ts:266

Registers all Plugin Map mutations with the GraphQL builder.

This function exposes the following mutations:
- `logPluginMapRequest`: Logs user/admin interaction.
- `clearPluginMapRequests`: Clears interaction logs.
- `logPluginMapPoll`: Logs generic polls.
- `clearPluginMapPolls`: Clears generic poll logs.

## Parameters

### builderInstance

`any`

The Pothos schema builder instance.

## Returns

`void`
