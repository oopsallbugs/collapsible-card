/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { HomeAssistant, LovelaceCard, LovelaceCardConfig } from 'custom-card-helpers';

import type { CollapsibleCardConfig } from './types';
import { CARD_VERSION, DEFAULT_ANIMATION_DURATION, DEFAULT_OPEN } from './const';
import { styles } from './styles';

// Console log for debugging
console.info(
  `%c  COLLAPSIBLE-CARD \n%c  Version ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// Register with HA card picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'collapsible-card',
  name: 'Collapsible Card',
  description: 'Animated collapsible wrapper for any Lovelace card',
});

@customElement('collapsible-card')
export class CollapsibleCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private _config!: CollapsibleCardConfig;
  @state() private _open = false;
  @state() private _showContent = false;
  @state() private _animating = false;

  @query('.container') private _container?: HTMLDivElement;

  private _card?: LovelaceCard;

  static get styles(): CSSResultGroup {
    return styles;
  }

  public setConfig(config: CollapsibleCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }
    if (!config.card) {
      throw new Error('You must define a card');
    }

    this._config = {
      animation_duration: DEFAULT_ANIMATION_DURATION,
      open: DEFAULT_OPEN,
      ...config,
    };

    // Set initial state
    this._open = this._config.open ?? DEFAULT_OPEN;
    this._showContent = this._open;

    // Create child card
    this._createCard(this._config.card);
  }

  public getCardSize(): number {
    // Return 1 when closed, actual size when open
    if (!this._open || !this._card) {
      return 1;
    }
    // getCardSize can return number or Promise<number>, we just return a sync estimate
    const childSize = this._card.getCardSize?.();
    if (typeof childSize === 'number') {
      return childSize + 1;
    }
    // If it's a promise or undefined, return a default
    return 2;
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    // Pass hass to child card
    if (changedProps.has('hass') && this._card) {
      this._card.hass = this.hass;
    }

    // Sync with entity state (for input_boolean persistence)
    if (changedProps.has('hass') && this._config?.entity && this.hass) {
      const entityState = this.hass.states[this._config.entity];
      if (entityState) {
        const shouldBeOpen = entityState.state === 'on';
        if (shouldBeOpen !== this._open && !this._animating) {
          this._open = shouldBeOpen;
          this._showContent = shouldBeOpen;
        }
      }
    }
  }

  protected render(): TemplateResult {
    if (!this._config) {
      return html``;
    }

    const animDuration = this._config.animation_duration ?? DEFAULT_ANIMATION_DURATION;

    return html`
      <ha-card>
        <div
          class="header"
          @click=${this._toggle}
          @keydown=${this._handleKeydown}
          tabindex="0"
          role="button"
          aria-expanded=${this._open}
        >
          ${this._config.icon
            ? html`<ha-icon icon=${this._config.icon}></ha-icon>`
            : ''}
          <span class="title">${this._config.title ?? ''}</span>
          <ha-icon
            class="chevron ${this._open ? 'open' : ''}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        <div
          class="container ${!this._open && !this._animating ? 'closed' : ''}"
          style="--collapsible-animation-duration: ${animDuration}ms"
          @transitionend=${this._transitionEnd}
        >
          <div class="content">
            ${this._showContent && this._card ? this._card : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  private async _createCard(config: LovelaceCardConfig): Promise<void> {
    // Use HA's card helpers to create the card element
    const helpers = await (window as any).loadCardHelpers();
    this._card = await helpers.createCardElement(config);

    if (this.hass) {
      this._card!.hass = this.hass;
    }

    this.requestUpdate();
  }

  private async _toggle(ev?: Event): Promise<void> {
    ev?.stopPropagation();

    if (this._animating) return;

    const container = this._container;
    if (!container) return;

    this._animating = true;
    const newOpen = !this._open;

    if (newOpen) {
      // Opening: show content first, then animate
      this._showContent = true;
      await this.updateComplete;

      // Force browser to calculate layout
      container.classList.remove('closed');
      const scrollHeight = container.scrollHeight;

      // Start from 0
      container.style.height = '0px';

      // Force reflow
      container.offsetHeight;

      // Animate to full height
      container.style.height = `${scrollHeight}px`;
    } else {
      // Closing: set explicit height, then animate to 0
      const scrollHeight = container.scrollHeight;
      container.style.height = `${scrollHeight}px`;

      // Force reflow
      container.offsetHeight;

      // Animate to 0
      container.style.height = '0px';
    }

    this._open = newOpen;

    // Update entity if configured
    if (this._config.entity && this.hass) {
      this.hass.callService('input_boolean', newOpen ? 'turn_on' : 'turn_off', {
        entity_id: this._config.entity,
      });
    }
  }

  private _transitionEnd(ev: TransitionEvent): void {
    if (ev.propertyName !== 'height') return;

    const container = this._container;
    if (!container) return;

    // Clean up explicit height
    container.style.removeProperty('height');

    if (!this._open) {
      this._showContent = false;
      container.classList.add('closed');
    }

    this._animating = false;
  }

  private _handleKeydown(ev: KeyboardEvent): void {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      this._toggle();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'collapsible-card': CollapsibleCard;
  }
}
