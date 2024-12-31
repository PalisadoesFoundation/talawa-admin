// config/vite.config.ts
import { defineConfig } from "file:///C:/Users/reesh/Desktop/talawa-admin/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/reesh/Desktop/talawa-admin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import viteTsconfigPaths from "file:///C:/Users/reesh/Desktop/talawa-admin/node_modules/vite-tsconfig-paths/dist/index.js";
import svgrPlugin from "file:///C:/Users/reesh/Desktop/talawa-admin/node_modules/vite-plugin-svgr/dist/index.js";
import EnvironmentPlugin from "file:///C:/Users/reesh/Desktop/talawa-admin/node_modules/vite-plugin-environment/dist/index.js";
var vite_config_default = defineConfig({
  // depending on your application, base can also be "/"
  build: {
    outDir: "build"
  },
  base: "",
  plugins: [
    react(),
    viteTsconfigPaths(),
    EnvironmentPlugin("all"),
    svgrPlugin({
      svgrOptions: {
        icon: true
        // ...svgr options (https://react-svgr.com/docs/options/)
      }
    })
  ],
  server: {
    // this ensures that the browser opens upon server start
    open: false,
    host: "0.0.0.0",
    // this sets a default port to 4321
    port: 4321
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiY29uZmlnL3ZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccmVlc2hcXFxcRGVza3RvcFxcXFx0YWxhd2EtYWRtaW5cXFxcY29uZmlnXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyZWVzaFxcXFxEZXNrdG9wXFxcXHRhbGF3YS1hZG1pblxcXFxjb25maWdcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3JlZXNoL0Rlc2t0b3AvdGFsYXdhLWFkbWluL2NvbmZpZy92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgdml0ZVRzY29uZmlnUGF0aHMgZnJvbSAndml0ZS10c2NvbmZpZy1wYXRocyc7XHJcbmltcG9ydCBzdmdyUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InO1xyXG5pbXBvcnQgRW52aXJvbm1lbnRQbHVnaW4gZnJvbSAndml0ZS1wbHVnaW4tZW52aXJvbm1lbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAvLyBkZXBlbmRpbmcgb24geW91ciBhcHBsaWNhdGlvbiwgYmFzZSBjYW4gYWxzbyBiZSBcIi9cIlxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdidWlsZCcsXHJcbiAgfSxcclxuICBiYXNlOiAnJyxcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgdml0ZVRzY29uZmlnUGF0aHMoKSxcclxuICAgIEVudmlyb25tZW50UGx1Z2luKCdhbGwnKSxcclxuICAgIHN2Z3JQbHVnaW4oe1xyXG4gICAgICBzdmdyT3B0aW9uczoge1xyXG4gICAgICAgIGljb246IHRydWUsXHJcbiAgICAgICAgLy8gLi4uc3ZnciBvcHRpb25zIChodHRwczovL3JlYWN0LXN2Z3IuY29tL2RvY3Mvb3B0aW9ucy8pXHJcbiAgICAgIH0sXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgLy8gdGhpcyBlbnN1cmVzIHRoYXQgdGhlIGJyb3dzZXIgb3BlbnMgdXBvbiBzZXJ2ZXIgc3RhcnRcclxuICAgIG9wZW46IGZhbHNlLFxyXG4gICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgLy8gdGhpcyBzZXRzIGEgZGVmYXVsdCBwb3J0IHRvIDQzMjFcclxuICAgIHBvcnQ6IDQzMjEsXHJcbiAgfSxcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsU0FBUyxvQkFBb0I7QUFDelYsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sdUJBQXVCO0FBQzlCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sdUJBQXVCO0FBRTlCLElBQU8sc0JBQVEsYUFBYTtBQUFBO0FBQUEsRUFFMUIsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLEVBQ1Y7QUFBQSxFQUNBLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLGtCQUFrQjtBQUFBLElBQ2xCLGtCQUFrQixLQUFLO0FBQUEsSUFDdkIsV0FBVztBQUFBLE1BQ1QsYUFBYTtBQUFBLFFBQ1gsTUFBTTtBQUFBO0FBQUEsTUFFUjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFFBQVE7QUFBQTtBQUFBLElBRU4sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsSUFFTixNQUFNO0FBQUEsRUFDUjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
