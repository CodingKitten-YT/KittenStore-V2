import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { AppCategory, APP_CATEGORIES, SortOption } from '../../types/repository';
import { ArrowDownAZ, ArrowDownWideNarrow, Calendar } from 'lucide-react-native';

interface SearchFiltersProps {
  selectedCategory: AppCategory;
  onSelectCategory: (category: AppCategory) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
}) => {
  const { theme } = useThemeContext();

  const sortOptions: { id: SortOption; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'name', 
      label: 'Name', 
      icon: <ArrowDownAZ size={16} color={sortBy === 'name' ? theme.colors.primary : theme.colors.secondaryText} />
    },
    { 
      id: 'date', 
      label: 'Date', 
      icon: <Calendar size={16} color={sortBy === 'date' ? theme.colors.primary : theme.colors.secondaryText} />
    },
    { 
      id: 'size', 
      label: 'Size', 
      icon: <ArrowDownWideNarrow size={16} color={sortBy === 'size' ? theme.colors.primary : theme.colors.secondaryText} />
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {APP_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { 
                backgroundColor: selectedCategory === category 
                  ? theme.colors.primary 
                  : theme.colors.searchBarBackground,
              },
            ]}
            onPress={() => onSelectCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                { 
                  color: selectedCategory === category 
                    ? '#FFFFFF' 
                    : theme.colors.text,
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortButton,
              { 
                backgroundColor: sortBy === option.id 
                  ? theme.colors.primary 
                  : theme.colors.searchBarBackground,
              },
            ]}
            onPress={() => onSortChange(option.id)}
          >
            {option.icon}
            <Text
              style={[
                styles.sortText,
                { 
                  color: sortBy === option.id 
                    ? '#FFFFFF' 
                    : theme.colors.text,
                },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  sortContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});