import { describe, test, expect, jest } from "@jest/globals";
import { parseRepoUrl } from "../fetch-repo";

describe("parseRepoUrl", () => {
  test("call trim method on input", () => {
    const trimSpy = jest.spyOn(String.prototype, "trim").mockReturnValue("");
    parseRepoUrl("test-repo-url");
    expect(trimSpy).toHaveBeenCalled();
    trimSpy.mockRestore();
  });

  test("return null if input is empty", () => {
    expect(parseRepoUrl("")).toBe(null);
  });

  test("replace url elements", () => {
    const replaceSpy = jest
      .spyOn(String.prototype, "replace")
      .mockReturnValue("");
    parseRepoUrl("test-repo-url");
    expect(replaceSpy).toHaveBeenCalledWith(/^git@([^:]+):/, "https://$1/");
    expect(replaceSpy).toHaveBeenCalledWith(/^https?:\/\//, "");
    expect(replaceSpy).toHaveBeenCalledWith(/\.git$/, "");
    expect(replaceSpy).toHaveBeenCalledWith(/\/$/, "");
    replaceSpy.mockRestore();
  });

  test("return null if parts of url is less than 3", () => {
    expect(parseRepoUrl("test-repo-url")).toBe(null);
  });

  test("return null if host will be not github or codeberg", () => {
    expect(parseRepoUrl("https://google.com")).toBe(null);
  });

  test("return null if owner and repo is not present in url", () => {
    expect(parseRepoUrl("https://github.com/")).toBe(null);
  });

  test("returns expected output for github repo url", () => {
    const result = parseRepoUrl("https://github.com/ForrestKnight/sizeof");
    const expectedResult = {
      host: "github",
      owner: "ForrestKnight",
      repo: "sizeof",
      branch: undefined,
    };

    expect(result).toEqual(expectedResult);
  });

  test("returns expected output from github https repo url", () => {
    const result = parseRepoUrl("https://github.com/ForrestKnight/sizeof.git");
    const expectedResult = {
      host: "github",
      owner: "ForrestKnight",
      repo: "sizeof",
      branch: undefined,
    };

    expect(result).toEqual(expectedResult);
  });

  test("returns expected output from github ssh repo url", () => {
    const result = parseRepoUrl("git@github.com:ForrestKnight/sizeof.git");
    const expectedResult = {
      host: "github",
      owner: "ForrestKnight",
      repo: "sizeof",
      branch: undefined,
    };

    expect(result).toEqual(expectedResult);
  });

  test("returns expected output from codeberg https repo url", () => {
    const result = parseRepoUrl(
      "https://codeberg.org/ForrestKnight/sizeof.git",
    );
    const expectedResult = {
      host: "codeberg",
      owner: "ForrestKnight",
      repo: "KiCraft",
      branch: undefined,
    };

    expect(result).toEqual(expectedResult);
  });

  test("returns expected output from tree github repo url", () => {
    const result = parseRepoUrl(
      "https://github.com/ForrestKnight/sizeof/tree/master",
    );
    const expectedResult = {
      host: "github",
      owner: "ForrestKnight",
      repo: "sizeof",
      branch: "master",
    };

    expect(result).toEqual(expectedResult);
  });

  test("returns expected output from tree codeberg repo url", () => {
    const result = parseRepoUrl(
      "https://codeberg.org/ForrestKnight/sizeof/src/branch/master",
    );
    const expectedResult = {
      host: "codeberg",
      owner: "ForrestKnight",
      repo: "sizeof",
      branch: "master",
    };

    expect(result).toEqual(expectedResult);
  });
});
