---
name: viveros-leads
description: Busca viveros y jardinerías en Costa Rica y genera una lista de prospectos con oportunidades de venta para compost orgánico y ornamentos de madera artesanal. Úsalo cuando necesites leads de viveros en CR.
disable-model-invocation: true
allowed-tools: Bash(python *), WebSearch
argument-hint: [provincia, ej: San José, Heredia, o "todo CR"]
---

# Viveros Leads CR

Busca viveros en Costa Rica para prospección B2B de dos productos:
- Compost orgánico
- Ornamentos de madera artesanal (Boheme Costa Rica)

## Pasos

1. Busca viveros y jardinerías en la zona: $ARGUMENTS
2. Por cada negocio encontrado, evalúa:
   - Si vende plantas ornamentales o decoración → marca "Compost + Madera"
   - Si es más agrícola o de producción → marca "Compost"
3. Ejecuta el script para guardar resultados:
   python ~/.claude/skills/viveros-leads/scripts/generar_leads.py "$ARGUMENTS"
4. Confirma que se generó el archivo viveros_leads.csv
5. Resume cuántos leads encontraste y qué oportunidades detectaste