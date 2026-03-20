"""
Raspa Google Maps con Playwright (sin API key).
Busca viveros en 5 provincias de Costa Rica.
Extrae: nombre, teléfono/WhatsApp, email (desde web), provincia.
Guarda en viveros_costa_rica.csv

Instalar:
    pip install playwright beautifulsoup4 requests
    playwright install chromium
"""

import csv
import re
import time

import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

PROVINCIAS = [
    "San José Costa Rica",
    "Heredia Costa Rica",
    "Cartago Costa Rica",
    "Alajuela Costa Rica",
    "Guanacaste Costa Rica",
]

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")
IGNORAR_EMAILS = ["sentry", "example", "noreply", "no-reply", ".png", ".jpg", ".svg", "w3.org", "schema"]

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}


def limpiar_nombre_provincia(provincia_query):
    return provincia_query.replace(" Costa Rica", "")


def extraer_email_web(url):
    if not url:
        return ""
    try:
        res = requests.get(url, headers=HEADERS, timeout=6)
        soup = BeautifulSoup(res.text, "html.parser")
        texto = soup.get_text(separator=" ")
        for email in EMAIL_RE.findall(texto):
            if not any(ig in email.lower() for ig in IGNORAR_EMAILS):
                return email
    except Exception:
        pass
    return ""


def raspar_provincia(page, provincia_query):
    provincia = limpiar_nombre_provincia(provincia_query)
    query = f"viveros {provincia_query}"
    print(f"\nBuscando: {query}")

    url = f"https://www.google.com/maps/search/{requests.utils.quote(query)}"
    page.goto(url, wait_until="networkidle")
    time.sleep(2)

    # Scroll para cargar más resultados
    panel = page.query_selector('div[role="feed"]')
    if panel:
        for _ in range(6):
            panel.evaluate("el => el.scrollTop += 800")
            time.sleep(1.5)

    # Obtener todos los resultados
    resultados = page.query_selector_all('a[href*="/maps/place/"]')
    hrefs = list({r.get_attribute("href") for r in resultados if r.get_attribute("href")})
    print(f"  {len(hrefs)} lugares encontrados.")

    leads = []

    for href in hrefs[:25]:  # máx 25 por provincia
        try:
            page.goto(href, wait_until="networkidle")
            time.sleep(2)

            # Nombre
            nombre_el = page.query_selector('h1')
            nombre = nombre_el.inner_text().strip() if nombre_el else ""
            if not nombre:
                continue

            # Teléfono
            telefono = ""
            tel_el = page.query_selector('[data-tooltip="Copiar número de teléfono"]')
            if not tel_el:
                tel_el = page.query_selector('button[data-item-id^="phone"]')
            if tel_el:
                telefono = tel_el.get_attribute("aria-label") or tel_el.inner_text()
                telefono = re.sub(r"[^\d+]", "", telefono)
                if telefono and not telefono.startswith("+"):
                    telefono = "+506" + telefono

            # Website
            website = ""
            web_el = page.query_selector('a[data-item-id="authority"]')
            if web_el:
                website = web_el.get_attribute("href") or ""

            print(f"    {nombre[:45]} | {telefono} | {website[:40]}")

            email = extraer_email_web(website)
            time.sleep(0.8)

            leads.append({
                "nombre": nombre,
                "whatsapp": telefono,
                "email": email,
                "provincia": provincia,
                "website": website,
            })

        except Exception as e:
            print(f"    [error] {e}")
            continue

    return leads


def main():
    todos = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            locale="es-CR",
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        )
        page = context.new_page()

        for provincia_query in PROVINCIAS:
            leads = raspar_provincia(page, provincia_query)
            todos.extend(leads)

        browser.close()

    # Guardar CSV
    output = "viveros_costa_rica.csv"
    campos = ["nombre", "whatsapp", "email", "provincia", "website"]
    with open(output, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
        writer.writerows(todos)

    print(f"\nListo. {len(todos)} viveros guardados en '{output}'")


if __name__ == "__main__":
    main()
