
## 📊 Google Analytics

To enable Google Analytics:

1.  Open `config.yaml` (or edit via CMS > Global Settings).
2.  Add your Measurement ID (G-XXXXXXXXXX):

    ```yaml
    params:
      google_analytics_id: "G-XXXXXXXXXX"
    ```

3.  The JSON API (`/api/global.json`) will expose this ID.
4.  The Frontend (`ltg-front`) will automatically initialize GA if this ID is present.
