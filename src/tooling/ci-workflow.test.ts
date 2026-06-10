import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const workflowPath = resolve(process.cwd(), ".github/workflows/ci.yml");

describe("CI workflow", () => {
  it("runs on pull requests to main and enforces ordered quality gates", () => {
    expect(existsSync(workflowPath)).toBe(true);

    const workflow = readFileSync(workflowPath, "utf8");

    expect(workflow).toContain("pull_request:");
    expect(workflow).toContain("- main");
    expect(workflow).toContain("typecheck:");
    expect(workflow).toContain("lint:");
    expect(workflow).toContain("needs: typecheck");
    expect(workflow).toContain("test:");
    expect(workflow).toContain("needs: lint");
    expect(workflow).toContain("run: pnpm test --coverage");
    expect(workflow).toContain("build:");
    expect(workflow).toContain("needs: test");
    expect(workflow).toContain("run: pnpm build");
    expect(workflow).toContain("e2e:");
    expect(workflow).toContain("needs: build");
    expect(workflow).toContain("run: pnpm test:e2e");
    expect(workflow).toContain("visual-regression:");
    expect(workflow).toContain("needs: e2e");
  });
});

describe("Vitest coverage guardrails", () => {
  it("enforces at least 80% branch and line coverage", () => {
    const vitestConfigPath = resolve(process.cwd(), "vitest.config.ts");
    const vitestConfig = readFileSync(vitestConfigPath, "utf8");

    expect(vitestConfig).toContain("coverage:");
    expect(vitestConfig).toContain("branches: 80");
    expect(vitestConfig).toContain("lines: 80");
  });
});

describe("CI documentation", () => {
  it("documents CI gate order and coverage threshold in README", () => {
    const readmePath = resolve(process.cwd(), "README.md");
    const readme = readFileSync(readmePath, "utf8");

    expect(readme).toContain("## CI pipeline");
    expect(readme).toContain("typecheck");
    expect(readme).toContain("lint");
    expect(readme).toContain("test --coverage");
    expect(readme).toContain("build");
    expect(readme).toContain("test:e2e");
    expect(readme).toContain("visual regression");
    expect(readme).toContain("80%");
  });
});
