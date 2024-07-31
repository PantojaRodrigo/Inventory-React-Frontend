import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "^@mui/(.*)": "@mui/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
};

export default config;
