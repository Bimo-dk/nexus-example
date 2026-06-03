/**
 * Static catalog of all 20 demo components exposed by remote-one + remote-two.
 *
 * In a real app this could be discovered from the remoteEntry.json manifest
 * (which lists `exposes`), or stored in the registry record. Hardcoding here
 * keeps the demo simple and explicit.
 */

export interface DemoSpec {
  remote: 'remoteOne' | 'remoteTwo';
  expose: string;
  title: string;
  description: string;
}

export const DEMO_CATALOG: DemoSpec[] = [
  // remote-one — data display
  { remote: 'remoteOne', expose: 'MetricCard',       title: 'Metric Card',       description: 'Gradient KPI card with trend' },
  { remote: 'remoteOne', expose: 'MiniLineChart',    title: 'Mini Line Chart',   description: 'Sparkline with gradient fill' },
  { remote: 'remoteOne', expose: 'DonutChart',       title: 'Donut Chart',       description: 'SVG donut with legend' },
  { remote: 'remoteOne', expose: 'ActivityFeed',     title: 'Activity Feed',     description: 'Recent events with icons' },
  { remote: 'remoteOne', expose: 'ProgressMulti',    title: 'Multi Progress',    description: 'CPU/Memory/Disk/Net bars' },
  { remote: 'remoteOne', expose: 'WeatherCard',      title: 'Weather Card',      description: 'Conditions + metrics' },
  { remote: 'remoteOne', expose: 'StatPills',        title: 'Stat Pills',        description: 'Status badges in row' },
  { remote: 'remoteOne', expose: 'CalendarHeatmap',  title: 'Calendar Heatmap',  description: 'Contribution grid' },
  { remote: 'remoteOne', expose: 'GaugeChart',       title: 'Gauge Chart',       description: 'Semi-circular gauge' },
  { remote: 'remoteOne', expose: 'EventTimeline',    title: 'Event Timeline',    description: 'Vertical deploy timeline' },

  // remote-two — interactive
  { remote: 'remoteTwo', expose: 'SearchAutocomplete', title: 'Search Autocomplete', description: 'Search with dropdown' },
  { remote: 'remoteTwo', expose: 'TagInput',           title: 'Tag Input',           description: 'Add/remove chips' },
  { remote: 'remoteTwo', expose: 'DateRangePicker',    title: 'Date Range Picker',   description: 'From/to + presets' },
  { remote: 'remoteTwo', expose: 'MultiSelect',        title: 'Multi Select',        description: 'Checkbox list with filter' },
  { remote: 'remoteTwo', expose: 'SliderRange',        title: 'Slider Range',        description: 'Dual-handle range' },
  { remote: 'remoteTwo', expose: 'ColorPicker',        title: 'Color Picker',        description: 'HSL with preview' },
  { remote: 'remoteTwo', expose: 'Rating',             title: 'Star Rating',         description: 'Interactive stars' },
  { remote: 'remoteTwo', expose: 'TodoList',           title: 'Todo List',           description: 'Add/check/delete' },
  { remote: 'remoteTwo', expose: 'CommandPalette',     title: 'Command Palette',     description: 'Fuzzy command search' },
  { remote: 'remoteTwo', expose: 'CodeEditor',         title: 'Code Editor',         description: 'Textarea with stats' },
];

/** Split the catalog evenly across the 4 loading patterns (5 each). */
export const PATTERN_SLICES = {
  route:        DEMO_CATALOG.slice(0, 5),
  eagerGrid:    DEMO_CATALOG.slice(5, 10),
  onDemand:     DEMO_CATALOG.slice(10, 15),
  dialog:       DEMO_CATALOG.slice(15, 20),
};
