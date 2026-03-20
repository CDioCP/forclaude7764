import sys
import csv
import datetime

def generar_leads(zona):
    # Lista base de ejemplo - Claude la completará con búsqueda real
    leads = []
    
    # Archivo de salida
    fecha = datetime.datetime.now().strftime("%Y%m%d")
    nombre_archivo = f"viveros_leads_{fecha}.csv"
    
    with open(nombre_archivo, "w", newline="", encoding="utf-8") as f:
        campos = ["Nombre", "Provincia", "Telefono", "Instagram", "Web", "Oportunidad", "Notas"]
        writer = csv.DictWriter(f, fieldnames=campos)
        writer.writeheader()
    
    print(f"✅ Archivo creado: {nombre_archivo}")
    print(f"📍 Zona buscada: {zona}")
    print("🔍 Claude completará los leads con búsqueda web...")

if __name__ == "__main__":
    zona = sys.argv[1] if len(sys.argv) > 1 else "Costa Rica"
    generar_leads(zona)