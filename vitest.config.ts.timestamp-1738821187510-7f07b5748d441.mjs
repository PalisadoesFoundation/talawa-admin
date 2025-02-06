// vitest.config.ts
import { defineConfig } from 'file:///C:/Users/hustl/admin/talawa-admin/node_modules/vitest/dist/config.js';
import react from 'file:///C:/Users/hustl/admin/talawa-admin/node_modules/@vitejs/plugin-react/dist/index.mjs';
import { nodePolyfills } from 'file:///C:/Users/hustl/admin/talawa-admin/node_modules/vite-plugin-node-polyfills/dist/index.js';
import tsconfigPaths from 'file:///C:/Users/hustl/admin/talawa-admin/node_modules/vite-tsconfig-paths/dist/index.js';
import svgrPlugin from 'file:///C:/Users/hustl/admin/talawa-admin/node_modules/vite-plugin-svgr/dist/index.js';
var vitest_config_default = defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ['events'],
    }),
    tsconfigPaths(),
    svgrPlugin(),
  ],
  test: {
    include: ['src/**/*.spec.{js,jsx,ts,tsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts',
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reportsDirectory: './coverage/vitest',
      exclude: [
        'node_modules',
        'dist',
        '**/*.{spec,test}.{js,jsx,ts,tsx}',
        'coverage/**',
        '**/index.{js,ts}',
        '**/*.d.ts',
        'src/test/**',
        'vitest.config.ts',
        'vitest.setup.ts',
        // Exclude from coverage if necessary
      ],
      reporter: ['text', 'html', 'text-summary', 'lcov'],
    },
  },
});
export { vitest_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXGh1c3RsXFxcXGFkbWluXFxcXHRhbGF3YS1hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcaHVzdGxcXFxcYWRtaW5cXFxcdGFsYXdhLWFkbWluXFxcXHZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2h1c3RsL2FkbWluL3RhbGF3YS1hZG1pbi92aXRlc3QuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZyc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IG5vZGVQb2x5ZmlsbHMgfSBmcm9tICd2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxscyc7XHJcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtdHNjb25maWctcGF0aHMnO1xyXG5pbXBvcnQgc3ZnclBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1xyXG4gICAgcmVhY3QoKSxcclxuICAgIG5vZGVQb2x5ZmlsbHMoe1xyXG4gICAgICBpbmNsdWRlOiBbJ2V2ZW50cyddLFxyXG4gICAgfSksXHJcbiAgICB0c2NvbmZpZ1BhdGhzKCksXHJcbiAgICBzdmdyUGx1Z2luKCksXHJcbiAgXSxcclxuICB0ZXN0OiB7XHJcbiAgICBpbmNsdWRlOiBbJ3NyYy8qKi8qLnNwZWMue2pzLGpzeCx0cyx0c3h9J10sXHJcbiAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXHJcbiAgICBzZXR1cEZpbGVzOiAndml0ZXN0LnNldHVwLnRzJyxcclxuICAgIGNvdmVyYWdlOiB7XHJcbiAgICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgIHByb3ZpZGVyOiAnaXN0YW5idWwnLFxyXG4gICAgICByZXBvcnRzRGlyZWN0b3J5OiAnLi9jb3ZlcmFnZS92aXRlc3QnLFxyXG4gICAgICBleGNsdWRlOiBbXHJcbiAgICAgICAgJ25vZGVfbW9kdWxlcycsXHJcbiAgICAgICAgJ2Rpc3QnLFxyXG4gICAgICAgICcqKi8qLntzcGVjLHRlc3R9Lntqcyxqc3gsdHMsdHN4fScsXHJcbiAgICAgICAgJ2NvdmVyYWdlLyoqJyxcclxuICAgICAgICAnKiovaW5kZXgue2pzLHRzfScsXHJcbiAgICAgICAgJyoqLyouZC50cycsXHJcbiAgICAgICAgJ3NyYy90ZXN0LyoqJyxcclxuICAgICAgICAndml0ZXN0LmNvbmZpZy50cycsXHJcbiAgICAgICAgJ3ZpdGVzdC5zZXR1cC50cycsIC8vIEV4Y2x1ZGUgZnJvbSBjb3ZlcmFnZSBpZiBuZWNlc3NhcnlcclxuICAgICAgXSxcclxuICAgICAgcmVwb3J0ZXI6IFsndGV4dCcsICdodG1sJywgJ3RleHQtc3VtbWFyeScsICdsY292J10sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1TLFNBQVMsb0JBQW9CO0FBQ2hVLE9BQU8sV0FBVztBQUNsQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUV2QixJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsTUFDWixTQUFTLENBQUMsUUFBUTtBQUFBLElBQ3BCLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxJQUNkLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTLENBQUMsK0JBQStCO0FBQUEsSUFDekMsU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsU0FBUztBQUFBLE1BQ1QsVUFBVTtBQUFBLE1BQ1Ysa0JBQWtCO0FBQUEsTUFDbEIsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsVUFBVSxDQUFDLFFBQVEsUUFBUSxnQkFBZ0IsTUFBTTtBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
