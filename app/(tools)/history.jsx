import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { RadarChart } from "@salmonco/react-native-radar-chart";
import { getEvaluations, deleteEvaluation } from '../../utils/storage';
import { COLORS, SIZES } from '../../utils/styles';
import Barrita from '../../components/barrita';

export default function HistoryScreen() {
  const [evaluations, setEvaluations] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      loadEvaluations();
    }, [])
  );

  const loadEvaluations = async () => {
    try {
      const data = await getEvaluations();
      setEvaluations(data);
      
      // Extraer grupos únicos incluyendo null/undefined como 'Sin Grupo'
      const uniqueGroups = [...new Set(data.map(item => item.group || 'Sin Grupo').filter(Boolean))];
      setGroups(uniqueGroups);
      
      console.log('Grupos cargados:', uniqueGroups); // Debug
      console.log('Evaluaciones cargadas:', data); // Debug
    } catch (error) {
      console.error('Error al cargar evaluaciones:', error);
    }
  };

  const handleDelete = async (id) => {
    await deleteEvaluation(id);
    loadEvaluations(); // Recargar después de eliminar
  };

  const filteredEvaluations = selectedGroup
    ? evaluations.filter(item => (item.group || 'Sin Grupo') === selectedGroup)
    : evaluations;

  const renderItem = ({ item }) => (
    <View style={styles.evaluationCard}>
      <Text style={styles.methodName}>{item.name}</Text>
      <Text style={styles.origin}>{item.origin}</Text>
      <Text style={styles.groupName}>
        Grupo: {item.group || 'Sin Grupo'}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
      
      <View style={styles.chartContainer}>
        <RadarChart
          data={Object.entries(item.ratings).map(([label, value]) => ({
            label: label.charAt(0).toUpperCase() + label.slice(1),
            value: value * 10,
          }))}
          maxValue={100}
          width={250}
          height={250}
          gradientColor={{
            startColor: "#FF9432",
            endColor: "#FFF8F1",
            count: 5,
          }}
          stroke={["#FFE8D3", "#FFE8D3", "#FFE8D3", "#FFE8D3", "#FF9432"]}
          strokeWidth={[0.5, 0.5, 0.5, 0.5, 1]}
          labelColor="#433D3A"
          dataFillColor="#FF9432"
          dataFillOpacity={0.8}
          isCircle
          showAxisValue={true}
          axisValueStyle={{
            fontSize: 10,
            fill: "#666666"
          }}
          axisValue={[2, 4, 6, 8, 10].map(v => v * 10)}
        />
      </View>

      <View style={styles.ratingsContainer}>
        {Object.entries(item.ratings).map(([key, value]) => (
          <View key={key} style={styles.ratingItem}>
            <Text style={styles.ratingLabel}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </Text>
            <Text style={styles.ratingValue}>{value}</Text>
          </View>
        ))}
      </View>

      {item.flavors.length > 0 && (
        <View style={styles.flavorsContainer}>
          <Text style={styles.sectionTitle}>Sabores:</Text>
          <View style={styles.flavorTags}>
            {item.flavors.map(flavor => (
              <View key={flavor} style={styles.flavorTag}>
                <Text style={styles.flavorText}>{flavor}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {item.notes && (
        <Text style={styles.notes}>Notas: {item.notes}</Text>
      )}

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.deleteButtonText}>Eliminar</Text>
      </TouchableOpacity>

    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.groupsScroll}
      >
        <TouchableOpacity
          style={[
            styles.groupTag,
            !selectedGroup && styles.groupTagSelected
          ]}
          onPress={() => setSelectedGroup(null)}
        >
          <Text style={[
            styles.groupTagText,
            !selectedGroup && styles.groupTagTextSelected
          ]}>
            Todos
          </Text>
        </TouchableOpacity>
        {groups.map((group) => (
          <TouchableOpacity
            key={group}
            style={[
              styles.groupTag,
              selectedGroup === group && styles.groupTagSelected
            ]}
            onPress={() => setSelectedGroup(group)}
          >
            <Text style={[
              styles.groupTagText,
              selectedGroup === group && styles.groupTagTextSelected
            ]}>
              {group}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredEvaluations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Barrita />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContainer: {
    padding: SIZES.padding,
  },
  evaluationCard: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.padding,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.padding,
    backgroundColor: 'white',
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  methodName: {
    fontSize: SIZES.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  origin: {
    fontSize: SIZES.medium,
    color: COLORS.secondary,
    marginTop: 4,
  },
  timestamp: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginTop: 4,
  },
  ratingsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingItem: {
    flexDirection: 'row',
    width: '50%',
    marginVertical: 4,
  },
  ratingLabel: {
    fontSize: SIZES.small,
    color: COLORS.gray,
  },
  ratingValue: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  flavorsContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: SIZES.small,
    color: COLORS.gray,
    marginBottom: 4,
  },
  flavorTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  flavorTag: {
    backgroundColor: COLORS.lightGray,
    borderRadius: SIZES.radius / 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
  },
  flavorText: {
    fontSize: SIZES.small,
    color: COLORS.secondary,
  },
  notes: {
    marginTop: 12,
    fontSize: SIZES.small,
    color: COLORS.gray,
    fontStyle: 'italic',
  },
  deleteButton: {
    marginTop: 8,
    padding: 8,
    backgroundColor: COLORS.error,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: COLORS.white,
    fontSize: SIZES.small,
    fontWeight: '600',
  },
  groupsScroll: {
    flexGrow: 0,
  },
  groupTag: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  groupTagSelected: {
    backgroundColor: COLORS.primary,
  },
  groupTagText: {
    color: COLORS.primary,
    fontSize: 14,
  },
  groupTagTextSelected: {
    color: COLORS.white,
  },
  groupName: {
    fontSize: SIZES.small,
    color: COLORS.primary,
    marginTop: 4,
    fontStyle: 'italic',
  },
}); 