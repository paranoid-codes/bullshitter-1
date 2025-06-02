import { serve } from "bun";
import app  from "./server";

serve({
  fetch: app.fetch,
  port: 3001,
});
