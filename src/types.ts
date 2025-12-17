import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CollapsibleCardConfig extends LovelaceCardConfig {
  type: string;
  title?: string;
  icon?: string;
  open?: boolean;
  animation_duration?: number;
  // State persistence via input_boolean entity
  entity?: string;
  // The wrapped card configuration
  card: LovelaceCardConfig;
}

// For future multi-section support
export interface SectionState {
  open: boolean;
  showContent: boolean;
  animating: boolean;
}
