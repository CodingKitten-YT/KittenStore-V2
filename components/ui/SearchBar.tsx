import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { useThemeContext } from '../../context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search apps...'
}) => {
  const { theme } = useThemeContext();
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: value.length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value.length, animation]);

  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.searchBarBackground }
    ]}>
      <Search size={18} color={theme.colors.secondaryText} style={styles.searchIcon} />
      
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text }
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.secondaryText}
        value={value}
        onChangeText={onChangeText}
        clearButtonMode="never"
      />
      
      {value.length > 0 && (
        <Animated.View
          style={[
            styles.clearButtonContainer,
            {
              opacity: animation,
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.clearButton}
            onPress={onClear}
            activeOpacity={0.6}
          >
            <X size={16} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  searchIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 16,
  },
  clearButtonContainer: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
});