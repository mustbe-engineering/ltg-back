import os

files_to_rename = [
    "content/manifesto.md",
    "content/blog/mujeres-lore.md",
    "content/blog/bienvenida.md",
    "content/blog/etiqueta-commander.md",
    "content/podcast/ep4-etiqueta.md",
    "content/events/taller-encantamientos.md",
    "content/events/torneo-bienvenida.md",
    "content/events/tea-party.md",
]

for f in files_to_rename:
    if os.path.exists(f):
        new_name = f.replace(".md", ".es.md")
        os.rename(f, new_name)
        print(f"Renamed {f} to {new_name}")
    else:
        print(f"File not found: {f}")
