import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { EventCard, EventData } from "./EventCard";

interface EventListProps {
  events: EventData[];
  onPressEvent?: (eventId: string) => void;
}

export function EventList({ events, onPressEvent }: EventListProps) {
  const renderItem = ({ item }: { item: EventData }) => (
    <EventCard event={item} onPress={onPressEvent} />
  );

  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
  },
});
