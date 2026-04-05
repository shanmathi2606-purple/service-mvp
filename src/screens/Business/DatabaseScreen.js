// Chart config for BarChart and LineChart
const chartConfig = {
  backgroundGradientFrom: '#1a1a2e',
  backgroundGradientTo: '#0f3460',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`, // blue
  labelColor: (opacity = 1) => `rgba(187, 222, 251,${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '5',
    strokeWidth: '2',
    stroke: '#1976d2',
  },
  fillShadowGradient: '#2196f3',
  fillShadowGradientOpacity: 0.3,
  barPercentage: 0.6,
  useShadowColorFromDataset: false,
};

import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import BusinessBottomNav from '../../../components/BusinessBottomNav';


const sampleWeeklyData = {
  bookings: [1, 2, 2, 3, 2, 4, 2],
  revenue: [30, 50, 40, 60, 45, 80, 50],
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
};

const sampleMonthlyData = {
  bookings: [40, 50, 55, 45],
  revenue: [2200, 3200, 4100, 2700],
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
};

export default function DatabaseScreen() {
  const [viewMode, setViewMode] = useState('weekly');
  const data = viewMode === 'weekly' ? sampleWeeklyData : sampleMonthlyData;

  const totalBookings = data.bookings.reduce((a, b) => a + b, 0);
  const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);

  // For weekly, show date range (sample)
  const weekRange = 'Mar 9 - Mar 15, 2026';
  // For monthly, show month (sample)
  const monthRange = 'March 2026';

  // Navigation for bottom nav
  // If you use react-navigation, get navigation from props or useNavigation hook
  // For now, assume navigation is passed as prop
  // If you use useNavigation, uncomment the next line:
  // const navigation = useNavigation();
  const navigation = undefined;

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Animated Overlay (static for now) */}
      <LinearGradient
        colors={['rgba(33, 150, 243, 0.18)', 'rgba(100, 181, 246, 0.12)', 'rgba(13, 71, 161, 0.08)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { zIndex: 0 }]}
      />
      <View style={{ flex: 1, width: '100%', alignItems: 'center', zIndex: 1 }}>
        <Text style={styles.title}>Business Dashboard</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'weekly' && styles.toggleActive]}
            onPress={() => setViewMode('weekly')}
          >
            <Text style={viewMode === 'weekly' ? styles.toggleTextActive : styles.toggleText}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'monthly' && styles.toggleActive]}
            onPress={() => setViewMode('monthly')}
          >
            <Text style={viewMode === 'monthly' ? styles.toggleTextActive : styles.toggleText}>Monthly</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateRange}>{viewMode === 'weekly' ? weekRange : monthRange}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Bookings</Text>
            <Text style={styles.statValue}>{totalBookings}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Revenue</Text>
            <Text style={styles.statValue}>${totalRevenue}</Text>
          </View>
        </View>
        <Text style={styles.chartTitle}>Bookings {viewMode === 'weekly' ? 'This Week' : 'This Month'}</Text>
        <BarChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.bookings }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          showBarTops={false}
          withInnerLines={true}
          withHorizontalLines={true}
          withVerticalLines={true}
        />
        <Text style={styles.chartTitle}>Revenue {viewMode === 'weekly' ? 'This Week' : 'This Month'}</Text>
        <LineChart
          data={{
            labels: data.labels,
            datasets: [{ data: data.revenue }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={chartConfig}
          style={styles.chart}
          fromZero
          withInnerLines={true}
          withHorizontalLines={true}
          withVerticalLines={true}
        />
        <BusinessBottomNav navigation={navigation} active="Home" />
      </View>
    </View>
  );
}


// Bottom Nav Icon Component (simple version)
function NavIcon({ label }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2196f3', marginBottom: 2 }} />
      <Text style={{ color: '#fff', fontSize: 12 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    marginTop: 10,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: 'rgba(33, 150, 243, 0.12)',
    borderRadius: 20,
    padding: 4,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  toggleActive: {
    backgroundColor: '#2196f3',
  },
  toggleText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  dateRange: {
    fontSize: 16,
    color: '#bbdefb',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(26,26,46,0.85)',
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    color: '#b3e5fc',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    marginBottom: 4,
    alignSelf: 'flex-start',
    marginLeft: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26,26,46,0.95)',
    paddingVertical: 10,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});




