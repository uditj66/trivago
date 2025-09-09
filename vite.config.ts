import { reactRouter } from "@react-router/dev/vite";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig((config) => {
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    /* syncfusion is heavy UI components based library so if we use csr then it takes lot of time to load these components
   on browser as it is javascript heavy so we SSR t oavoid load timings and better SEO ,but if we don't do noExternal;[/@syncfusion/] then during bundling the syncfusion code is treated as External i.e externalized dependencies are loaded as-is from node_modules and not processed or bundled by Vite.So to avoid it we say don't treat syncfusion code as external include its code in bundling so that server also includes to process its code and serve back to client.*/
    ssr: {
      noExternal: [/@syncfusion/],
    },
  };
});
