import { defineConfig, devices } from "@playwright/test";

const runningFromGit = !!process.env["GIT_EXEC_PATH"];

export default defineConfig({
  testDir: "./tests",
  expect: {
    toHaveScreenshot: {
      stylePath: "./tests/screenshot.css",
    },
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["list"],
    [
      "html",
      {
        host: "0.0.0.0",
        open: runningFromGit || !!process.env.CI ? "never" : "on-failure",
      },
    ],
  ],
  use: {
    baseURL: "http://localhost:5173/gin-rummy-scoreboard/",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:5173/gin-rummy-scoreboard/",
    reuseExistingServer: !process.env.CI,
  },
});
