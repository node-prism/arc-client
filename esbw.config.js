export default {
  artifactsCommon: {
    bundle: true,
    platform: "node",
    sourcemap: true,
  },
  artifacts: {
    main: {
      format: "esm",
      entryPoints: ["src/index.ts"],
      outfile: "dist/index.js",
    },
  },
  serveMode: {
    index: "public/index.html",
    build: ["main"],
    watchPaths: ["src/**/*.{ts,tsx}", "public/index.html"],
    injectArtifacts: ["main"],
  },
  runMode: {
    build: ["main"],
    watchPaths: ["src/**/*.{ts,tsx}"],
    runfile: "dist/index.js",
  },
  watchMode: {
    build: ["main"],
    watchPaths: ["src/**/*.{ts,tsx}"],
  },
  buildMode: {
    build: ["main"],
    minify: true,
    minifyWhitespace: true,
  }
}
