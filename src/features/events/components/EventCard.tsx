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

// 화면 너비 계산
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 36) / 2; // 카드 너비 (2열 그리드)

export function EventCard({ event, onPress }: EventCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark ? "#2c2c2c" : "#ffffff",
          shadowColor: isDark ? "#000" : "#888",
          width: cardWidth,
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
        {event.isFree !== undefined && (
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
        )}
      </View>

      <View style={styles.contentContainer}>
        <Text style={[styles.date, { color: "#999999" }]} numberOfLines={1}>
          {event.date}
        </Text>

        <Text
          style={[styles.location, { color: isDark ? "#dddddd" : "#191919" }]}
          numberOfLines={1}
        >
          {event.location}
        </Text>

        <Text
          style={[styles.title, { color: isDark ? "#ffffff" : "#191919" }]}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {event.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    flexDirection: "column",
    margin: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    height: "auto",
    aspectRatio: 3 / 4,
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
    fontWeight: "500",
    marginTop: 4,
    fontFamily: "Pretendard",
  },
  location: {
    fontSize: 12,
    marginBottom: 2,
  },
  date: {
    fontSize: 10,
    color: "#999999",
  },
});
