const FOLDER_PREFIX_MAP = {
  AdminPortal: "/admin",
  UserPortal: "/user",
  Auth: "/auth",
};

const screenRouteRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Ensure React Router <Route path> matches screen folder structure",
    },
    schema: [],
  },

  create(context) {
    const filename = (
      context.filename ?? context.getFilename()
    ).replace(/\\/g, "/");

    if (
      filename.includes(".spec.") ||
      filename.includes(".test.") ||
      filename.includes("__tests__")
    ) {
      return {};
    }
    
    if (!filename.includes("src/screens")) {
      return {};
    }

    const parts = filename.split("/");
    const screensIndex = parts.findIndex((p) => p === "screens");

    if (screensIndex === -1 || screensIndex + 1 >= parts.length) {
      return {};
    }

    const folderName = parts[screensIndex + 1];
    const expectedPrefix = FOLDER_PREFIX_MAP[folderName];

    if (!expectedPrefix) {
      return {};
    }

    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "Route") return;

        const pathProp = node.attributes.find(
          (attr) =>
            attr.type === "JSXAttribute" && attr.name.name === "path"
        );

        if (!pathProp) return;

        const value = pathProp.value;
        // Skip non-literal values (dynamic props, template literals, etc.)
        if (!value || value.type !== "Literal") return;

        const route = value.value;
        if (route !== expectedPrefix && !route.startsWith(expectedPrefix + "/")) {
          context.report({
            node: value,
            message: `Routes in "${folderName}" must start with "${expectedPrefix}"`,
          });
        }
      },
    };
  },
};

export default screenRouteRule;

export const screenRouteConfig = {
  plugins: {
    "screen-route": {
      rules: {
        enforce: screenRouteRule,
      },
    },
  },
  rules: {
    "screen-route/enforce": "error",
  },
};