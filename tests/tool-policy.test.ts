import { describe, expect, it } from "vitest";
import { authorizeToolRequest } from "../src/ai/tool-policy";

describe("authorizeToolRequest", () => {
  it("allows a known approved tool", () => {
    expect(authorizeToolRequest("search_knowledge_base").allowed).toBe(true);
  });

  it("denies an unlisted tool", () => {
    expect(authorizeToolRequest("delete_all_customer_data").allowed).toBe(false);
  });
});
