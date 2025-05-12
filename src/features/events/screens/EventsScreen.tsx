import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CategoryTabs } from "../components/CategoryTabs";
import { EventData } from "../components/EventCard";
import { EventList } from "../components/EventList";
import { FilterChips } from "../components/FilterChips";
import { mockEvents } from "../data/mockEvents";

export function EventsScreen() {
  const colorScheme = useColorScheme();
  const [selectedCategory, setSelectedCategory] = useState("festival");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventData[]>(mockEvents);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // 추후 카테고리별 필터링 로직 구현
  };

  const handleFilterSelect = (filters: string[]) => {
    setSelectedFilters(filters);
    // 추후 필터별 필터링 로직 구현
  };

  const handlePressEvent = (eventId: string) => {
    // 추후 이벤트 상세 페이지로 이동하는 로직 구현
    console.log(`Event pressed: ${eventId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View
        style={[
          styles.header,
          { backgroundColor: colorScheme === "dark" ? "#1a1a1a" : "#ffffff" },
        ]}
      >
        <CategoryTabs onSelectCategory={handleCategorySelect} />
        <FilterChips onSelectFilters={handleFilterSelect} />
      </View>

      <View style={styles.content}>
        <EventList events={filteredEvents} onPressEvent={handlePressEvent} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  content: {
    flex: 1,
  },
});
