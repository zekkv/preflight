import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("should load landing page and show content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("http://localhost:3000/");
    // Exact: the quickstart snippet also contains "preflight" (clone URL, `cd preflight`).
    await expect(page.getByText("preflight", { exact: true })).toBeVisible();
    await expect(page.getByRole("link", { name: /get started/i })).toBeVisible();
  });
});
