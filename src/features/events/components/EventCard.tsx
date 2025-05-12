import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 행사 데이터 타입 정의
export interface EventData {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  date: string;
  isFree: boolean;
  category: string;
}

interface EventCardProps {
  event: EventData;
  onPress?: (eventId: string) => void;
}

// 화면 너비의 절반에서 패딩과 간격을 고려한 카드 너비 계산
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 48) / 2; // 화면 너비의 절반에서 좌우 패딩 및 카드 간격 제외

export function EventCard({ event, onPress }: EventCardProps) {
  const colorScheme = useColorScheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === "dark" ? "#2c2c2c" : "#ffffff",
          shadowColor: colorScheme === "dark" ? "#000" : "#888",
        },
      ]}
      onPress={() => onPress && onPress(event.id)}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeContainer}>
          <View
            style={[
              styles.badge,
              { backgroundColor: event.isFree ? "#4CAF50" : "#FF9800" },
            ]}
          >
            <Text style={styles.badgeText}>
              {event.isFree ? "무료" : "유료"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <Text
          style={[
            styles.title,
            { color: colorScheme === "dark" ? "#ffffff" : "#000000" },
          ]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.title}
        </Text>

        <View style={styles.infoContainer}>
          <Text
            style={[
              styles.location,
              { color: colorScheme === "dark" ? "#dddddd" : "#555555" },
            ]}
            numberOfLines={1}
          >
            {event.location}
          </Text>

          <Text
            style={[
              styles.date,
              { color: colorScheme === "dark" ? "#bbbbbb" : "#777777" },
            ]}
            numberOfLines={1}
          >
            {event.date}
          </Text>
        </View>

        <View style={styles.categoryContainer}>
          <Text
            style={[
              styles.category,
              {
                backgroundColor: colorScheme === "dark" ? "#444" : "#f0f0f0",
                color: colorScheme === "dark" ? "#fff" : "#444",
              },
            ]}
          >
            {event.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeContainer: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  contentContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoContainer: {
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  categoryContainer: {
    flexDirection: "row",
  },
  category: {
    fontSize: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
});
