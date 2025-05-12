import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 필터 칩 타입 정의
interface FilterChip {
  id: string;
  label: string;
}

// 필터 칩 데이터
const filterChips: FilterChip[] = [
  { id: "free", label: "무료" },
  { id: "paid", label: "유료" },
  { id: "nearby", label: "내 주변" },
  { id: "new", label: "신규" },
  { id: "popular", label: "인기" },
  { id: "today", label: "오늘" },
  { id: "weekend", label: "주말" },
];

interface FilterChipsProps {
  onSelectFilters?: (selectedFilters: string[]) => void;
}

export function FilterChips({ onSelectFilters }: FilterChipsProps) {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const colorScheme = useColorScheme();

  const handleFilterPress = (filterId: string) => {
    const newSelectedFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];

    setSelectedFilters(newSelectedFilters);

    if (onSelectFilters) {
      onSelectFilters(newSelectedFilters);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filterChips.map((chip) => {
          const isSelected = selectedFilters.includes(chip.id);
          return (
            <TouchableOpacity
              key={chip.id}
              style={[
                styles.chip,
                isSelected && styles.selectedChip,
                {
                  backgroundColor: isSelected
                    ? colorScheme === "dark"
                      ? "#444"
                      : "#f0f0f0"
                    : colorScheme === "dark"
                    ? "#333"
                    : "#fff",
                  borderColor: colorScheme === "dark" ? "#555" : "#ddd",
                },
              ]}
              onPress={() => handleFilterPress(chip.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected
                      ? colorScheme === "dark"
                        ? "#fff"
                        : "#000"
                      : colorScheme === "dark"
                      ? "#ddd"
                      : "#666",
                  },
                ]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  selectedChip: {
    borderColor: "#bbb",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
