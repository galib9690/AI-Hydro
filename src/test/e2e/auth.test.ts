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
	await expect(sidebar.getByRole("button", { name: "Let's go!" })).toBeDisabled({ timeout: 30_000 })
	// Let startup state migration finish before writing provider secrets. Without
	// this guard, a first-run migration can observe the test key mid-write and
	// legitimately advance past the welcome view before the button assertion.
	await sidebar.waitForTimeout(500)

	// OpenRouter remains available, but complete setup with Gemini so entering a
	// synthetic key cannot trigger OpenRouter's balance endpoint.
	await expect(sidebar.getByRole("textbox", { name: "OpenRouter API Key" })).toBeVisible()
	await providerSelectorInput.click({ force: true })
	await expect(sidebar.getByTestId("provider-option-gemini")).toBeVisible()
	await sidebar.getByTestId("provider-option-gemini").click({ force: true })
	const apiKeyInput = sidebar.getByRole("textbox", {
		name: "Gemini API Key",
	})
	await expect(apiKeyInput).toBeVisible()
	await sidebar.waitForTimeout(250)
	await apiKeyInput.fill("test-api-key")
	const submitButton = sidebar.getByRole("button", { name: "Let's go!" })
	await expect(submitButton).toBeEnabled({ timeout: 30_000 })
	// The provider form rerenders its VS Code custom button as secret state is
	// persisted. Dispatch the current control's DOM click so hosted runners do
	// not race Playwright actionability against that legitimate replacement.
	await submitButton.evaluate((button: HTMLButtonElement) => button.click())

	// Verify the welcome page is no longer visible
	await expect(welcomeHeading).not.toBeVisible()
	await expect(apiKeyInput).not.toBeVisible()
	await expect(providerSelectorInput).not.toBeVisible()

	// Verify you are now in the chat page after setup was completed
	const chatInputBox = sidebar.getByTestId("chat-input")
	await expect(chatInputBox).toBeVisible()

	// Verify the current onboarding card can open provider settings from chat.
	await expect(sidebar.getByRole("heading", { name: "Get started with AI-Hydro" })).toBeVisible()
	await sidebar.getByRole("button", { name: "Provider settings" }).click()
	await expect(providerSelectorInput).toBeVisible()
	expect(providerRequests).toEqual([])
})
