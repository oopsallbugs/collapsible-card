# Collapsible Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

Animated collapsible wrapper for any Home Assistant Lovelace card.

![Collapsible Card Demo](https://i.imgflip.com/af63q9.jpg)

## Installation

### HACS (Recommended)

1. Open HACS → Frontend → ⋮ (menu) → Custom repositories
2. Add `https://github.com/oopsallbugs/collapsible-card`, select "Dashboard"
3. Install "Collapsible Card"
4. Restart Home Assistant

### Manual

1. Download `collapsible-card.js` from [Releases](../../releases)
2. Copy to `config/www/collapsible-card.js`
3. Add resource in Settings → Dashboards → ⋮ → Resources:
   - URL: `/local/collapsible-card.js`
   - Type: JavaScript Module

## Usage

```yaml
type: custom:collapsible-card
title: Weather
icon: mdi:weather-partly-cloudy
card:
  type: weather-forecast
  entity: weather.home
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | - | Header text |
| `icon` | string | - | Header icon (mdi:icon-name) |
| `open` | boolean | `false` | Initial state |
| `animation_duration` | number | `300` | Animation duration (ms) |
| `entity` | string | - | input_boolean for state persistence |
| `card` | object | **Required** | Card configuration to wrap |

## State Persistence

To remember open/closed state across refreshes, create an `input_boolean` helper and reference it:

```yaml
type: custom:collapsible-card
title: Lights
entity: input_boolean.collapsible_lights_open
card:
  type: entities
  entities:
    - light.living_room
```

## License

MIT
