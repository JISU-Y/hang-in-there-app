import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 카테고리 탭 타입 정의
interface CategoryTab {
  id: string;
  label: string;
}

// 카테고리 탭 데이터
const categoryTabs: CategoryTab[] = [
  { id: "festival", label: "축제" },
  { id: "performance", label: "공연" },
  { id: "exhibition", label: "전시" },
];

interface CategoryTabsProps {
  onSelectCategory?: (categoryId: string) => void;
}

export function CategoryTabs({ onSelectCategory }: CategoryTabsProps) {
  const [selectedTab, setSelectedTab] = useState(categoryTabs[0].id);
  const colorScheme = useColorScheme();

  const handleTabPress = (tabId: string) => {
    setSelectedTab(tabId);
    if (onSelectCategory) {
      onSelectCategory(tabId);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categoryTabs.map((tab) => {
          const isSelected = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isSelected && styles.selectedTab,
                { borderColor: colorScheme === "dark" ? "#555" : "#ddd" },
              ]}
              onPress={() => handleTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  isSelected && styles.selectedTabText,
                  {
                    color: isSelected
                      ? colorScheme === "dark"
                        ? "#ffffff"
                        : "#000000"
                      : colorScheme === "dark"
                      ? "#aaaaaa"
                      : "#777777",
                  },
                ]}
              >
                {tab.label}
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
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  selectedTab: {
    backgroundColor: "#f0f0f0",
    borderColor: "#bbb",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedTabText: {
    fontWeight: "700",
  },
});
