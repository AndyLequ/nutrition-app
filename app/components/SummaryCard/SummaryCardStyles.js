import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  summaryCard: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  summaryCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryCardStats: {
    marginTop: 8,
  },
  summaryCardStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#333',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
  },
});

export default styles;