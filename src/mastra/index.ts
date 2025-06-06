import { Mastra } from "@mastra/core/mastra";
import { LibSQLStore } from "@mastra/libsql";
import { registerCopilotKit } from "@mastra/agui";
import { weatherAgent } from "./agents";
import { createLogger, LogLevel } from "@mastra/core/logger";

const LOG_LEVEL = process.env.LOG_LEVEL as LogLevel || "info";
 
// Define your runtime context type
type WeatherRuntimeContext = {
  "user-id": string;
  "temperature-scale": "celsius" | "fahrenheit";
  "api-key": string;
  // ...
};
 
export const mastra = new Mastra({
  agents: { 
    weatherAgent
  },
  storage: new LibSQLStore({
    url: ":memory:"
  }),
  logger: createLogger({
    level: LOG_LEVEL,
  }),
  server: {
    // disable cors for getting started
    cors: {
      origin: "*",
      allowMethods: ["*"],
      allowHeaders: ["*"],
    },
    apiRoutes: [
      // 🪁 Copilot Runtime: https://docs.copilotkit.ai/guides/self-hosting
      registerCopilotKit<WeatherRuntimeContext>({
        path: "/copilotkit",
        resourceId: "weatherAgent",
        setContext: (c, runtimeContext) => {
          runtimeContext.set("user-id", c.req.header("X-User-ID") || "anonymous");
          // whatever context you need to set ...
        }
      }),
    ],
  },
});