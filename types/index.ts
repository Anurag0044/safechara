export interface TestRecord {
  testId: string;
  sampleType: 'Feed' | 'Silage';
  timestamp: string; // ISO date string
  proteinPct: number;
  moisturePct: number;
  fiberPct: number;
  phValue: number;
  conductivityValue: number;
  mouldDetected: boolean;
  ureaFlag: boolean;
  sandFlag: boolean;
  imageUrl?: string;
  advisoryText: string;
  syncStatus: 'Synced' | 'Pending';
}

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  DrawerNavigator: undefined;
  TestResults: { testId: string };
};

export type DrawerParamList = {
  Dashboard: undefined;
  TestFeed: undefined;
  TestSilage: undefined;
  History: undefined;
  Advisory: undefined;
  ConnectedDevices: undefined;
  Profile: undefined;
  HelpSupport: undefined;
  LanguageSelector: undefined;
};
