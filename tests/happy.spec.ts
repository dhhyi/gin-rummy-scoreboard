import { expect, test } from "@playwright/test";

test("happy path", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveScreenshot("start-screen.png");
  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - heading "Gin Rummy Scoreboard" [level=1]
    - img "App logo"
    - heading /Version. .+/
    - button "Spielverlauf"
    - button "Neues Spiel"
  `);

  await page.getByRole("button", { name: "Neues Spiel" }).click();

  await expect(page).toHaveScreenshot("new-game-screen.png");
  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - heading "Start" [level=1]
    - heading "Bitte gebt eure Namen ein:" [level=2]
    - textbox "Spieler 1"
    - textbox "Spieler 2"
    - button "Spiel starten" [disabled]
  `);

  await page.getByRole("textbox", { name: "Spieler 1" }).fill("Alice");
  await page.getByRole("textbox", { name: "Spieler 2" }).fill("Bob");
  await page.getByRole("button", { name: "Spiel starten" }).click();

  await expect(page).toHaveScreenshot("in-game-screen.png");
  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - button "Punkte anzeigen"
    - heading "Runde 1 läuft" [level=1]
    - heading "Alice muss geben." [level=2]
    - button "Runde beenden"
    `);

  await page.getByRole("button", { name: "Runde beenden" }).click();

  await expect(page).toHaveScreenshot("after-round-end-player-select.png");
  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - button "Punkte anzeigen"
    - heading "Runde 1 beendet" [level=1]
    - heading "Wer hat die Runde beendet?" [level=2]
    - button "Alice"
    - button "Bob"
  `);

  await page.getByRole("button", { name: "Alice" }).click();

  await expect(page).toHaveScreenshot("after-round-end-type-select.png");
  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - button "Punkte anzeigen"
    - heading "Runde beendet" [level=1]
    - heading "Alice, wie hast du beendet?" [level=2]
    - button "Klopfen"
    - button "Gin"
    - button "Big Gin"
  `);

  await page.getByRole("button", { name: "Gin", exact: true }).click();

  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - button "Punkte anzeigen"
    - heading "Abrechnung" [level=1]
    - heading "Bob, wie viel Totholz hast du?" [level=2]
    - spinbutton: "0"
    - button "OK" [disabled]
    `);

  await page.getByRole("spinbutton").fill("13");
  await page.getByRole("button", { name: "OK" }).click();

  await expect(page).toHaveScreenshot("after-first-round.png");
  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page.locator("#app")).toMatchAriaSnapshot(`
    - button "Punkte anzeigen"
    - heading "Runde 2 läuft" [level=1]
    - heading "Bob muss geben." [level=2]
    - button "Runde beenden"
    `);

  await page.getByRole("button", { name: "Runde beenden" }).click();
  await page.getByRole("button", { name: "Alice" }).click();
  await page.getByRole("button", { name: "Big Gin" }).click();
  await page.getByRole("spinbutton").fill("36");
  await page.getByRole("button", { name: "OK" }).click();

  await expect(page).toHaveScreenshot("after-second-round.png");
  await page.getByRole("button", { name: "Weiter" }).click();

  await expect(page).toHaveScreenshot("game-ending.png");

  await page.getByRole("button", { name: "Startbildschirm" }).click();

  await page.getByRole("button", { name: "Spielverlauf" }).click();
  await expect(page).toHaveScreenshot("game-history.png");
});
