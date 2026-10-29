// Everything that identifies your community lives in this folder.
// To run the app for your society, edit this file and the seed data in
// society/data.ts and society/data-extra.ts. App code never hardcodes names.
//
// The values below describe "Green Meadows", a fictional demo community.

export const society = {
  /** Product name shown in the sidebar, browser tab and installed app. */
  appName: 'OurSociety',
  name: 'Green Meadows Residents Welfare Association',
  shortName: 'Green Meadows',
  acronym: 'GMRWA',
  regNo: '0000/2020',
  location: 'Sector 12, Sampleville',
  pincode: '100001',
  established: 2020,
  totalPlots: 120,
  /** Annual maintenance per unit, in `currency`. */
  annualMaintenance: 12000,
  /** Where the maintenance rate was approved, shown under the rate. */
  maintenanceApprovedAt: 'AGM 2026',
  /** Financial year the maintenance figures cover. */
  maintenanceYear: '2026–27',
  /** Prefix for request ticket numbers, e.g. GM-2026-0001. */
  ticketPrefix: 'GM',
  /** Square logo in /public, shown in the sidebar. */
  logo: '/icon-192.png',

  /** Formatting for dates and money. Any BCP 47 locale and ISO 4217 currency. */
  locale: 'en-IN',
  currency: 'INR',

  /**
   * What your community calls its units and the groups they sit in.
   * Apartments might use Flat / Block / blocks; layouts use Plot / Road / lanes.
   */
  terms: {
    unit: 'House',
    units: 'houses',
    block: 'Street',
    blocks: 'streets',
  },

  /** Every block, road, tower or street, grouped for the Layout Plan page. */
  layout: [
    { group: 'Phase A', blocks: ['A1', 'A2', 'A3'] },
    { group: 'Phase B', blocks: ['B1', 'B2', 'B3'] },
    { group: 'Phase C', blocks: ['C1', 'C2'] },
  ],
  /** Block → landmark, highlighted on the Layout Plan page. */
  landmarks: {
    A1: 'Clubhouse',
    B2: 'Park & Play Area',
    C1: 'Sports Court',
  } as Record<string, string>,
  gates: ['Main Gate (24×7)', 'Service Gate (7 AM – 9 PM)'],

  /** Search text for the Google Maps embed and directions link. */
  mapQuery: 'Connaught Place, New Delhi',
  mapCoords: { lat: 28.6315, lng: 77.2167 },

  get roads() {
    return this.layout.flatMap((g) => g.blocks)
  },
}

/** Categories residents can file requests under. `icon` is a lucide-react icon name. */
export const requestCategories = [
  { id: 'sanitation', label: 'Sanitation & Garbage', icon: 'Trash2' },
  { id: 'drainage', label: 'Drainage & Plumbing', icon: 'Waves' },
  { id: 'cctv', label: 'CCTV & Security', icon: 'Cctv' },
  { id: 'water-power', label: 'Water & Electricity', icon: 'Zap' },
  { id: 'roads', label: 'Roads & Common Areas', icon: 'TrafficCone' },
] as const
