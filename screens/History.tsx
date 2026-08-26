import React, { useRef, useMemo } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { GradientMeshBackground } from '../components/GradientMeshBackground';
import { GlassCard } from '../components/GlassCard';
import { GlassHeader } from '../components/GlassHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import BottomSheet from '@gorhom/bottom-sheet';
import { BlurView } from 'expo-blur';
import QRCode from 'react-native-qrcode-svg';
import { scale } from '../utils/responsive';

const historyData = [
  { id: '1', type: 'Feed', status: 'good', date: '2023-10-25 10:30 AM', score: 92, qr: 'safechara://record/1' },
  { id: '2', type: 'Silage', status: 'caution', date: '2023-10-24 02:15 PM', score: 75, qr: 'safechara://record/2' },
  { id: '3', type: 'Feed', status: 'alert', date: '2023-10-22 09:00 AM', score: 40, qr: 'safechara://record/3' },
];

export const HistoryScreen = ({ navigation }: any) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%'], []);
  const [selectedRecord, setSelectedRecord] = React.useState<any>(null);

  const openQR = (record: any) => {
    setSelectedRecord(record);
    bottomSheetRef.current?.expand();
  };

  return (
    <GradientMeshBackground>
      <GlassHeader title="History & Traceability" navigation={navigation} />
      
      <View style={styles.container}>
        <GlassCard style={styles.searchBar} intensity={30}>
          <Feather name="search" size={20} color={colors.onSurfaceVariant} />
          <Text style={styles.searchText}>Search records...</Text>
        </GlassCard>

        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openQR(item)} activeOpacity={0.8}>
              <GlassCard style={styles.historyCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.cardType}>{item.type} Batch</Text>
                    <Text style={styles.cardDate}>{item.date}</Text>
                  </View>
                  <StatusBadge status={item.status as any} label={item.status} />
                </View>
                <View style={styles.cardFooter}>
                  <Text style={styles.scoreText}>Score: {item.score}/100</Text>
                  <Feather name="maximize" size={20} color={colors.primary} />
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
        />
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundComponent={({ style }) => (
          <BlurView intensity={70} tint="dark" style={[style, styles.bottomSheetBg]} />
        )}
        handleIndicatorStyle={{ backgroundColor: colors.onSurfaceVariant }}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Scan Traceability QR</Text>
          <Text style={styles.sheetSubtitle}>Batch: {selectedRecord?.date}</Text>
          
          <View style={styles.qrContainer}>
            {selectedRecord && (
              <QRCode
                value={selectedRecord.qr}
                size={scale(200)}
                color={colors.background}
                backgroundColor={colors.onSurface}
              />
            )}
          </View>
          
          <Text style={styles.scanInst}>Show this to buyers for full transparency.</Text>
        </View>
      </BottomSheet>
    </GradientMeshBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 24,
    borderRadius: 9999,
  },
  searchText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginLeft: 12,
  },
  list: {
    paddingBottom: 40,
    gap: 16,
  },
  historyCard: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardType: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: colors.onSurface,
  },
  cardDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  scoreText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: colors.onSurface,
  },
  bottomSheetBg: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  sheetContent: {
    padding: 24,
    alignItems: 'center',
  },
  sheetTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: colors.onSurface,
    marginBottom: 8,
  },
  sheetSubtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: colors.onSurfaceVariant,
    marginBottom: 32,
  },
  qrContainer: {
    padding: 24,
    backgroundColor: colors.onSurface,
    borderRadius: 24,
    marginBottom: 24,
  },
  scanInst: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
});
