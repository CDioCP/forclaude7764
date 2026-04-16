from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800})

    # Capture JS console errors
    errors = []
    page.on('console', lambda msg: errors.append(f"{msg.type}: {msg.text}") if msg.type in ('error', 'warning') else None)
    page.on('pageerror', lambda err: errors.append(f"PAGE ERROR: {err}"))

    page.goto('https://aastorage.web.app/', wait_until='networkidle')
    page.screenshot(path='/tmp/live_t0.png')

    active = page.query_selector('.pc-slide.active')
    slide_num = active.get_attribute('data-slide') if active else 'none'
    total = len(page.query_selector_all('.pc-slide'))
    print(f"t=0: active slide={slide_num}, total slides={total}")

    time.sleep(7)
    page.screenshot(path='/tmp/live_t7.png')
    active = page.query_selector('.pc-slide.active')
    slide_num = active.get_attribute('data-slide') if active else 'none'
    print(f"t=7s: active slide={slide_num} (expected: 1)")

    time.sleep(4)
    page.screenshot(path='/tmp/live_t11.png')
    active = page.query_selector('.pc-slide.active')
    slide_num = active.get_attribute('data-slide') if active else 'none'
    print(f"t=11s: active slide={slide_num} (expected: 2)")

    if errors:
        print("\nJS ERRORS:")
        for e in errors:
            print(" ", e)
    else:
        print("\nNo JS errors")

    browser.close()
