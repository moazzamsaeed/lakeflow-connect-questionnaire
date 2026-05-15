import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const stub = path.resolve(__dirname, "src/empty.js");

export default defineConfig({
  base: "/lakeflow-connect-preflight-checklist/",
  plugins: [react()],
  server: { port: 5179, host: true },
  // jsPDF only needs html2canvas + dompurify for its optional doc.html()
  // API. We render with doc.text()/rect() directly, so those modules are
  // dead code. Stubbing them keeps the bundle small and avoids gitleaks
  // false positives in the minified third-party JS shipped to gh-pages.
  resolve: {
    alias: {
      html2canvas: stub,
      dompurify: stub,
    },
  },
});
