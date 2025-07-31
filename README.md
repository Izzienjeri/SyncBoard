npm run dev

> syncboard@0.1.0 dev
> next dev --turbopack

   ▲ Next.js 15.4.5 (Turbopack)
   - Local:        http://localhost:3000
   - Network:      http://192.168.100.11:3000

 ✓ Starting...
 ✓ Ready in 1192ms
 ○ Compiling / ...
Error: Cannot apply unknown utility class `border-border`. Are you using CSS modules or similar and missing `@reference`? https://tailwindcss.com/docs/functions-and-directives#reference-directive
    [at onInvalidCandidate (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:18:1312)]
    [at ge (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:13:29803)]
    [at /home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:18:373]
    [at I (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:3:1656)]
    [at je (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:18:172)]
    [at bi (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:35:780)]
    [at process.processTicksAndRejections (node:internal/process/task_queues:105:5)]
    [at async yi (/home//dev/projects/syncboard/node_modules/tailwindcss/dist/lib.js:35:1123)]
    [at async _r (/home//dev/projects/syncboard/node_modules/@tailwindcss/node/dist/index.js:10:3384)]
    [at async p (/home//dev/projects/syncboard/node_modules/@tailwindcss/postcss/dist/index.js:10:4019)]
 ✓ Compiled / in 4.1s
 GET / 200 in 4627ms
 ✓ Compiled /favicon.ico in 337ms
 GET /favicon.ico?favicon.45db1c09.ico 200 in 632ms


