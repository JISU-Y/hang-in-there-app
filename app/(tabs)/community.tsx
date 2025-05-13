import { useColorScheme } from "@/hooks/useColorScheme";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CommunityScreen() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.content,
          { backgroundColor: colorScheme === "dark" ? "#1c1c1c" : "#bbf7d0" },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: colorScheme === "dark" ? "#ffffff" : "#000000" },
          ]}
        >
          동네소식 페이지
        </Text>
        <Text
          style={[
            styles.description,
            { color: colorScheme === "dark" ? "#cccccc" : "#333333" },
          ]}
        >
          여기에 커뮤니티 게시글이 표시됩니다
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
