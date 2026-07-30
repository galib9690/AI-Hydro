import { expect } from "@playwright/test"
import { cleanChatView } from "./utils/common"
import { E2E_WORKSPACE_TYPES, e2e } from "./utils/helpers"

e2e.describe("Diff Editor", () => {
	E2E_WORKSPACE_TYPES.forEach(({ title, workspaceType }) => {
		e2e.extend({
			workspaceType,
		})(title, async ({ helper, page, sidebar }) => {
			await helper.signin(sidebar)
			// Submit a message
			await cleanChatView(sidebar)

			const inputbox = sidebar.getByTestId("chat-input")
			await expect(inputbox).toBeVisible()

			await inputbox.fill("Hello, AI-Hydro!")
			await expect(inputbox).toHaveValue("Hello, AI-Hydro!")
			await sidebar.getByTestId("send-button").click({ delay: 100 })
			await expect(inputbox).toHaveValue("")

			// Assert the stable loopback response rather than a transient loading frame.
			await expect(sidebar.getByText("Hello! I'm a mock AI-Hydro API response.").first()).toBeVisible({
				timeout: 30_000,
			})

			// Back to home page with history
			await sidebar.getByRole("button", { name: "Start a New Task" }).click()
			await expect(sidebar.getByText("Recent Tasks")).toBeVisible()
			await expect(sidebar.getByText("Hello, AI-Hydro!")).toBeVisible() // History with the previous sent message
			const historyCard = sidebar.locator(".modern-card").filter({ hasText: "Hello, AI-Hydro!" })
			await expect(historyCard.locator(".modern-badge")).toHaveCount(2) // Input and output token badges

			// Submit a file edit request
			await sidebar.getByTestId("chat-input").click()
			await sidebar.getByTestId("chat-input").fill("edit_request")
			await sidebar.getByTestId("send-button").click({ delay: 50 })

			await expect(sidebar.getByText("AI Hydro wants to edit this file:")).toBeVisible({
				timeout: 30_000,
			})

			// AI-Hydro Diff Editor should open with the file name and diff
			await expect(page.getByText("test.ts: Original ↔ AI-Hydro's Changes (Editable)")).toBeVisible({
				timeout: 30_000,
			})

			// Diff editor should show the original and modified content
			const diffEditor = page.locator(
				".monaco-editor.modified-in-monaco-diff-editor > .overflow-guard > .monaco-scrollable-element.editor-scrollable > .lines-content > div:nth-child(4)",
			)
			await diffEditor.click()
			await expect(diffEditor).toBeVisible()

			await page.close()
		})
	})
})
