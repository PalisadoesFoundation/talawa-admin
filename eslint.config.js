export default [
    {
      ignores: [
        // Files and directories to ignore
        'src/components/CheckIn/tagTemplate.ts', // PDF tag as JSON string, skip linting
        'package.json',
        'package-lock.json',
        'tsconfig.json',
        
        // Docusaurus website subdirectory
        'docs/**',
      ],
    },
  ];

