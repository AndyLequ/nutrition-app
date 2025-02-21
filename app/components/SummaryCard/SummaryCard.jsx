import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import styles from './SummaryCardStyles';

const SummaryCard = ({ title, stats }) => {
  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryCardTitle}>{title}</Text>
      <View style={styles.summaryCardStats}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.summaryCardStat}>
            <Text style={styles.statLabel}>{stat.label}:</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

export default SummaryCard;