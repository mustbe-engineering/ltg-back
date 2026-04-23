# LTG CMS (Backend)

Este repositorio contiene el núcleo del CMS para **Ladies The Gathering**, basado en **Hugo** (generador de sitios estáticos) y **Decap CMS** (gestor de contenido).

## 🚀 Desarrollo Local

Para trabajar en el contenido localmente:

1. **Instalar Hugo**: Asegúrate de tener instalada la versión extendida de Hugo (`brew install hugo`).
2. **Iniciar Hugo Server**: Genera el API JSON en tiempo real.
   ```bash
   hugo server -D
   ```
3. **Iniciar Local CMS Proxy**: Para guardar cambios en Git localmente en lugar de subirlos a la nube inmediatamente.
   ```bash
   npx decap-server
   ```
4. **Acceso**:
   - CMS Admin: `http://localhost:1313/admin/`
   - API Base: `http://localhost:1313/index.json`

## 🌍 Estructura Multi-idioma

El proyecto está configurado para soportar **Español (es)** e **Inglés (en)**.

- El contenido se organiza en `content/es/` y `content/en/`.
- El CMS genera automáticamente las rutas correspondientes:
  - ES: `/blog/index.json`
  - EN: `/en/blog/index.json`

## 📦 Despliegue en Netlify

El sitio está configurado para desplegarse automáticamente al hacer push a `main`.

### Requerimientos:
- **Hugo Version**: Se recomienda definir `HUGO_VERSION = 0.148.2` (o superior) en las variables de entorno de Netlify.
- **Identity**: Asegúrate de tener activado **Netlify Identity** y el servicio **Git Gateway** en la configuración de Netlify para permitir el acceso al panel `/admin/`.

## 📊 Google Analytics

Para activar GA, edita el `config.yaml` o los Ajustes Globales en el CMS con tu ID de medición (`G-XXXXXXXXXX`). El frontend consumirá este valor automáticamente.
