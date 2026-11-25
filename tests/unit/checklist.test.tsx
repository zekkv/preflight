import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checklist, ChecklistItem } from "#/components/custom/checklist";
import { PageSection } from "#/components/custom/page-section";

describe("Checklist", () => {
  it("renders each item's label and value as one list item", () => {
    render(
      <Checklist aria-label="Status">
        <ChecklistItem label="Session" value="Active" mark="cleared" />
        <ChecklistItem label="Notes" value="2" />
      </Checklist>
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe("SessionActive");
    expect(items[1].textContent).toBe("Notes2");
  });

  it("adds nothing to the accessible text when an item is marked", () => {
    render(
      <Checklist aria-label="Status">
        <ChecklistItem label="Sign-in" value="Passkey" mark="tick" />
        <ChecklistItem label="Email" value="Not verified" mark="fault" />
        <ChecklistItem label="Plain" value="No" />
      </Checklist>
    );

    // The tick, status dot and leader are aria-hidden decoration: only label and value remain.
    const items = screen.getAllByRole("listitem");
    expect(items.map(item => item.textContent)).toEqual([
      "Sign-inPasskey",
      "EmailNot verified",
      "PlainNo",
    ]);
    expect(screen.queryByRole("img")).toBeNull();
  });
});

describe("PageSection", () => {
  it("is a region named by its title", () => {
    render(
      <PageSection title="Linked providers" description="Ways you can sign in.">
        <p>content</p>
      </PageSection>
    );

    const region = screen.getByRole("region", { name: "Linked providers" });
    expect(region.textContent).toContain("Ways you can sign in.");
    expect(region.textContent).toContain("content");
  });

  it("derives a valid id from a title with punctuation", () => {
    render(
      <PageSection title="Danger zone!">
        <p>content</p>
      </PageSection>
    );

    expect(screen.getByRole("heading", { name: "Danger zone!" }).id).toBe("section-danger-zone-");
  });
});
