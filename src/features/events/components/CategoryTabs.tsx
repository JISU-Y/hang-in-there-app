import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  // TODO: 추후 추가
  //   { id: "education", label: "교육/체험" },
  //   { id: "youth", label: "아동/청소년" },
];

interface CategoryTabsProps {
  onSelectCategory?: (categoryId: string) => void;
}

interface TabItemProps {
  tab: CategoryTab;
  isSelected: boolean;
  onPress: () => void;
  activeTabSharedValue: SharedValue<number>;
  index: number;
  isDark: boolean;
}

function TabItem({
  tab,
  isSelected,
  onPress,
  activeTabSharedValue,
  index,
  isDark,
}: TabItemProps) {
  const tabRef = useRef<View>(null);

  // 텍스트 색상 애니메이션
  const textColor = useDerivedValue(() => {
    const isActive = activeTabSharedValue.value === index;
    return interpolateColor(
      isActive ? 1 : 0,
      [0, 1],
      isDark ? ["#aaaaaa", "#ffffff"] : ["#767676", "#191919"],
    );
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: textColor.value,
      fontWeight: activeTabSharedValue.value === index ? "700" : "400",
    };
  });

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={() => {
        onPress();
        tabRef.current?.measure((x, y, width, height, pageX) => {
          // 탭의 중앙 위치를 전달
          activeTabSharedValue.value = index;
        });
      }}
      activeOpacity={0.7}
    >
      <View ref={tabRef}>
        <Animated.Text style={[styles.tabText, animatedTextStyle]}>
          {tab.label}
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
}

export function CategoryTabs({ onSelectCategory }: CategoryTabsProps) {
  const [selectedTab, setSelectedTab] = useState(categoryTabs[0].id);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const scrollViewRef = useRef<ScrollView>(null);
  const tabPositions = useRef<{ [key: string]: number }>({});

  // 활성 탭 인덱스를 저장하는 Shared Value
  const activeTabIndex = useSharedValue(0);

  // 인디케이터 x 위치
  const indicatorPosition = useSharedValue(0);

  // 인디케이터 너비
  const indicatorWidth = useSharedValue(0);

  // 인디케이터 애니메이션 스타일
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(indicatorPosition.value, { damping: 15 }) },
      ],
      width: withSpring(indicatorWidth.value, { damping: 15 }),
    };
  });

  const handleTabPress = (tabId: string, index: number) => {
    setSelectedTab(tabId);

    // 선택된 탭의 인덱스
    activeTabIndex.value = index;

    if (onSelectCategory) {
      onSelectCategory(tabId);
    }
  };

  const handleTabLayout = (
    tabId: string,
    index: number,
    x: number,
    width: number,
  ) => {
    tabPositions.current[tabId] = x;

    // 첫 번째 탭 또는 현재 선택된 탭인 경우 인디케이터 위치 설정
    if (
      (index === 0 && indicatorPosition.value === 0) ||
      tabId === selectedTab
    ) {
      indicatorPosition.value = x;
      indicatorWidth.value = width;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {categoryTabs.map((tab, index) => {
          const isSelected = selectedTab === tab.id;

          return (
            <View
              key={tab.id}
              onLayout={(e) => {
                const { x, width } = e.nativeEvent.layout;
                handleTabLayout(tab.id, index, x, width);
              }}
            >
              <TabItem
                tab={tab}
                isSelected={isSelected}
                onPress={() => handleTabPress(tab.id, index)}
                activeTabSharedValue={activeTabIndex}
                index={index}
                isDark={isDark}
              />

              {isSelected && (
                <View
                  style={styles.selectedTabMeasure}
                  onLayout={(e) => {
                    const { width } = e.nativeEvent.layout;
                    const x = tabPositions.current[tab.id] || 0;

                    indicatorPosition.value = x;
                    indicatorWidth.value = width;
                  }}
                />
              )}
            </View>
          );
        })}

        {/* 하단 인디케이터 */}
        <Animated.View
          style={[
            styles.indicator,
            {
              backgroundColor: isDark ? "#ffffff" : "#191919",
            },
            indicatorStyle,
          ]}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    position: "relative",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  tab: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 10,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  selectedTabMeasure: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    opacity: 0,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    borderRadius: 1,
  },
});
