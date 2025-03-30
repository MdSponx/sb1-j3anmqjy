export interface CrewRoleStats {
  role: string;
  count: number;
  percentage: number;
}

export const ROLE_COLORS: Record<string, string> = {
  'Director of Photography': '#FF4D4D',    // Bright red
  'Production Designer': '#00CC88',        // Vibrant green
  'Sound Engineer': '#3399FF',             // Bright blue
  'Editor': '#9933FF',                     // Vibrant purple
  'Costume Designer': '#FF9933',           // Bright orange
  'Makeup Artist': '#FF66B2',              // Vibrant pink
  'Lighting': '#6666FF',                   // Bright indigo
  'Art Director': '#66CC33',               // Vibrant lime
  'Script Supervisor': '#FF6666',          // Bright coral
  'Production Manager': '#00CCCC',         // Vibrant teal
  'Other': '#808080'                       // Medium gray
};