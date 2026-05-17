import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";

// Export routes for Next App Router
// Note: UploadThing will throw errors if not configured
// The client-side component handles these errors gracefully
// and directs users to use URL input instead
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
