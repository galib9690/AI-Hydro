import { expect } from "@playwright/test"
import { e2e } from "./utils/helpers"

// Test for setting up API keys
e2e("Views - can set up API keys and navigate to Settings from Chat", async ({ page, sidebar }) => {
	const providerRequests: string[] = []
	await page.route(/^https:\/\/(openrouter\.ai|generativelanguage\.googleapis\.com)\//, async (route) => {
		providerRequests.push(route.request().url())
		await route.abort("blockedbyclient")
	})

	const welcomeHeading = sidebar.getByRole("heading", { name: "Hi, I'm AI-Hydro" })
	const providerSelectorInput = sidebar.getByTestId("provider-selector-input")

	// Verify the current inline provider setup is visible.
	await expect(welcomeHeading).toBeVisible()
	await expect(providerSelectorInput).toBeVisible()

	// OpenRouter remains available, but complete setup with Gemini so entering a
	// synthetic key cannot trigger OpenRouter's balance endpoint.
	await expect(sidebar.getByRole("textbox", { name: "OpenRouter API Key" })).toHaveValue("")
	await providerSelectorInput.click({ force: true })
	await expect(sidebar.getByTestId("provider-option-gemini")).toBeVisible()
	await sidebar.getByTestId("provider-option-gemini").click({ force: true })
	const apiKeyInput = sidebar.getByRole("textbox", {
		name: "Gemini API Key",
	})
	await expect(apiKeyInput).toBeVisible()
	await apiKeyInput.fill("test-api-key")
	const submitButton = sidebar.getByRole("button", { name: "Let's go!" })
	const chatInputBox = sidebar.getByTestId("chat-input")
	let submitDispatched = false
	await expect
		.poll(
			async () => {
				if (await chatInputBox.isVisible()) {
					return true
				}
				// On a clean profile the one-time welcome migration can finish
				// after the key is stored and advance directly to Chat. If the
				// form remains, complete the same transition through its current
				// rerendered custom button.
				if (!submitDispatched && (await submitButton.isVisible()) && (await submitButton.isEnabled())) {
					try {
						await submitButton.evaluate((button: HTMLButtonElement) => button.click())
						submitDispatched = true
					} catch {
						// The migration may replace the form between the visibility
						// check and dispatch; the next poll observes the Chat view.
					}
				}
				return chatInputBox.isVisible()
			},
			{ timeout: 30_000 },
		)
		.toBe(true)

	// Verify the welcome page is no longer visible
	await expect(welcomeHeading).not.toBeVisible()
	await expect(apiKeyInput).not.toBeVisible()
	await expect(providerSelectorInput).not.toBeVisible()

	// Verify you are now in the chat page after setup was completed
	await expect(chatInputBox).toBeVisible()

	// Verify the current onboarding card can open provider settings from chat.
	await expect(sidebar.getByRole("heading", { name: "Get started with AI-Hydro" })).toBeVisible()
	await sidebar.getByRole("button", { name: "Provider settings" }).click()
	await expect(providerSelectorInput).toBeVisible()
	expect(providerRequests).toEqual([])
})
