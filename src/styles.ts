import { css } from 'lit';

export const styles = css`
  :host {
    --collapsible-animation-duration: 300ms;
  }

  ha-card {
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    user-select: none;
    border-radius: var(--ha-card-border-radius, 12px);
  }

  .header:hover {
    background: var(--secondary-background-color);
  }

  .header:focus {
    outline: none;
    background: var(--secondary-background-color);
  }

  .header:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: -2px;
  }

  .header ha-icon {
    color: var(--paper-item-icon-color, #44739e);
    margin-right: 12px;
    flex-shrink: 0;
  }

  .title {
    flex: 1;
    font-weight: 500;
    font-size: 16px;
    color: var(--primary-text-color);
  }

  .chevron {
    color: var(--secondary-text-color);
    transition: transform var(--collapsible-animation-duration) ease;
    flex-shrink: 0;
  }

  .chevron.open {
    transform: rotate(180deg);
  }

  .container {
    overflow: hidden;
    transition: height var(--collapsible-animation-duration) cubic-bezier(0.4, 0, 0.2, 1);
  }

  .container.closed {
    height: 0 !important;
  }

  .content {
    padding: 0 16px 16px;
  }

  /* Ensure child card fills the space properly */
  .content > * {
    display: block;
  }
`;
