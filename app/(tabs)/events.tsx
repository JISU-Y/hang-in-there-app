import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EventsScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.content,
          { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#f5d0fe" },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colorScheme === "dark" ? "#ffffff" : "#000000" },
          ]}
        >
          행사 페이지
        </Text>
        <Text
          style={[
            styles.description,
            { color: colorScheme === "dark" ? "#cccccc" : "#333333" },
          ]}
        >
          여기에 행사 목록이 표시됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
  },
});
