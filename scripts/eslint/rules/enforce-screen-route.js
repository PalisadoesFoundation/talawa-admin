import path from "path";

const FOLDER_PREFIX_MAP = {
  AdminPortal: "/admin",
  UserPortal: "/user",
  Auth: "/auth",
  Public: "/",
};

export default {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure React Router <Route path> matches screen folder structure",
    },
    schema: [],
  },

  create(context) {
    const filename = context.getFilename();

    // Ignore tests
    if (
      filename.includes(".spec.") ||
      filename.includes(".test.") ||
      filename.includes("__tests__")
    ) {
      return {};
    }

    // Only apply to screens
    if (!filename.includes(`src${path.sep}screens`)) {
      return {};
    }

    const parts = filename.split(path.sep);
    const screensIndex = parts.findIndex((p) => p === "screens");

    if (screensIndex === -1 || screensIndex + 1 >= parts.length) {
      return {};
    }

    const folderName = parts[screensIndex + 1];
    const expectedPrefix = FOLDER_PREFIX_MAP[folderName];

    if (!expectedPrefix || folderName === "Public") {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        // Only check <Route>
        if (node.name.name !== "Route") return;

        const pathProp = node.attributes.find(
          (attr) =>
            attr.type === "JSXAttribute" && attr.name.name === "path"
        );

        if (!pathProp) return;

        const value = pathProp.value;

        if (!value || value.type !== "Literal") return;

        const route = value.value;

        if (!route.startsWith(expectedPrefix)) {
          context.report({
            node: value,
            message: `Routes in "${folderName}" must start with "${expectedPrefix}"`,
          });
        }
      },
    };
  },
};
