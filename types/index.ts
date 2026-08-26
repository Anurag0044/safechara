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
  Login: undefined;
  Register: undefined;
  ProfilePictureSetup: undefined;
  DrawerNavigator: undefined;
  TestResults: {
    result?: unknown;
    sampleType?: 'Feed' | 'Silage';
    cattleType?: 'cow' | 'buffalo';
    cattleCondition?: 'lactating' | 'pregnant' | 'normal';
    imageUri?: string;
  };
};

export type DrawerParamList = {
  Dashboard: undefined;
  CattleTypeSelection: {
    cattleType?: 'cow' | 'buffalo';
    cattleCondition?: 'lactating' | 'pregnant' | 'normal';
  } | undefined;
  CattleConditionSelection: {
    cattleType: 'cow' | 'buffalo';
    cattleCondition?: 'lactating' | 'pregnant' | 'normal';
  };
  FeedSampleUpload: {
    cattleType: 'cow' | 'buffalo';
    cattleCondition: 'lactating' | 'pregnant' | 'normal';
    imageUri?: string;
  };
  TestFeed: {
    sampleType?: 'Feed';
    cattleType?: 'cow' | 'buffalo';
    cattleCondition?: 'lactating' | 'pregnant' | 'normal';
    imageUri?: string;
  } | undefined;
  TestSilage: { sampleType?: 'Silage' } | undefined;
  History: undefined;
  Advisory: undefined;
  ConnectedDevices: undefined;
  Profile: undefined;
  HelpSupport: undefined;
  LanguageSelector: undefined;
};
