import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NexusRemote, NexusComponent } from '../nexus-remote.local';

@NexusRemote({ exposeAs: 'WeatherCard' })
@NexusComponent({
    "title": "Weather Card",
    "description": "Gradient weather widget with metrics",
    "category": "data-display",
    "tags": [
      "weather",
      "card"
    ],
    "icon": "cloud",
    "inputs": {
      "city": {
        "type": "string",
        "default": "Copenhagen"
      },
      "condition": {
        "type": "string",
        "default": "Partly cloudy"
      },
      "icon": {
        "type": "string",
        "default": "partly cloudy emoji"
      },
      "temp": {
        "type": "number",
        "default": 18
      },
      "feels": {
        "type": "number",
        "default": 17
      },
      "wind": {
        "type": "number",
        "default": 12
      },
      "humidity": {
        "type": "number",
        "default": 64
      }
    }
  })
@Component({
  selector: 'demo-weather-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card">
      <div class="top">
        <div>
          <div class="city">{{ city() }}</div>
          <div class="cond">{{ condition() }}</div>
        </div>
        <div class="icon">{{ icon() }}</div>
      </div>
      <div class="temp">{{ temp() }}°<span>C</span></div>
      <div class="meta">
        <span>Feels {{ feels() }}°</span>
        <span>Wind {{ wind() }} km/h</span>
        <span>Hum {{ humidity() }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .card { padding: 18px 22px; background: linear-gradient(135deg, #0ea5e9, #6366f1); color: white; border-radius: 14px; min-width: 220px; }
    .top { display: flex; justify-content: space-between; align-items: flex-start; }
    .city { font-size: 16px; font-weight: 600; }
    .cond { font-size: 12px; opacity: 0.85; }
    .icon { font-size: 36px; }
    .temp { font-size: 44px; font-weight: 700; margin: 8px 0; font-variant-numeric: tabular-nums; }
    .temp span { font-size: 18px; opacity: 0.7; }
    .meta { display: flex; gap: 12px; font-size: 11px; opacity: 0.85; }
  `],
})
export default class WeatherCardComponent {
  readonly city = input<string>('Copenhagen');
  readonly condition = input<string>('Partly cloudy');
  readonly icon = input<string>('⛅');
  readonly temp = input<number>(18);
  readonly feels = input<number>(17);
  readonly wind = input<number>(12);
  readonly humidity = input<number>(64);
}
