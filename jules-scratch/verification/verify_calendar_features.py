from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:5173/calendar")
    page.wait_for_load_state("networkidle")

    # Click the settings button
    page.click('button[aria-label="Settings"]')

    # Click the button to highlight Monday
    page.click('button:text("Lunes")')

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
