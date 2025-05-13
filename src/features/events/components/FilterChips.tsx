import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

// TODO: 지역 데이터 불러오기
const REGIONS = [
  "서울",
  "인천",
  "경기",
  "강원",
  "경남",
  "경북",
  "대구",
  "부산",
  "울산",
  "광주",
  "전남",
  "전북",
  "대전",
  "세종",
  "충남",
  "충북",
  "제주",
];

// 진행 상태 데이터
const STATUS_OPTIONS = ["진행 중", "진행 예정", "진행 마감"];

// 화면 높이의 최대 70% 사용
const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_DROPDOWN_HEIGHT = SCREEN_HEIGHT * 0.7;

interface FilterOption {
  id: string;
  label: string;
}

interface FilterCategory {
  id: string;
  label: string;
  options: FilterOption[];
  isOpen: boolean;
}

interface FilterChipsProps {
  onSelectFilters?: (category: string, selectedOptions: string[]) => void;
}

export function FilterChips({ onSelectFilters }: FilterChipsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // 필터 카테고리 상태
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([
    {
      id: "region",
      label: "지역별 검색",
      options: REGIONS.map((region) => ({
        id: region.toLowerCase(),
        label: region,
      })),
      isOpen: false,
    },
    {
      id: "status",
      label: "행사 진행 상태",
      options: STATUS_OPTIONS.map((status) => ({
        id: status.toLowerCase().replace(/\s/g, "_"),
        label: status,
      })),
      isOpen: false,
    },
  ]);

  // 선택된 필터 옵션들
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: string[];
  }>({
    region: [],
    status: [],
  });

  // 애니메이션 값 (1: 열림, 0: 닫힘)
  const regionDropdownAnim = useSharedValue(0);
  const statusDropdownAnim = useSharedValue(0);

  // 드롭다운 애니메이션 스타일
  const regionDropdownStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(
        regionDropdownAnim.value,
        [0, 1],
        [0, MAX_DROPDOWN_HEIGHT],
      ),
      opacity: regionDropdownAnim.value,
      overflow: "hidden",
    };
  });

  const statusDropdownStyle = useAnimatedStyle(() => {
    return {
      maxHeight: interpolate(
        statusDropdownAnim.value,
        [0, 1],
        [0, MAX_DROPDOWN_HEIGHT],
      ),
      opacity: statusDropdownAnim.value,
      overflow: "hidden",
    };
  });

  // 필터 카테고리 토글
  const toggleFilterCategory = useCallback(
    (categoryId: string) => {
      setFilterCategories((prev) =>
        prev.map((category) => ({
          ...category,
          isOpen: category.id === categoryId ? !category.isOpen : false,
        })),
      );

      // 애니메이션 적용
      if (categoryId === "region") {
        regionDropdownAnim.value = withSpring(
          filterCategories[0].isOpen ? 0 : 1,
          { damping: 15 },
        );
        statusDropdownAnim.value = withTiming(0, { duration: 200 });
      } else if (categoryId === "status") {
        statusDropdownAnim.value = withSpring(
          filterCategories[1].isOpen ? 0 : 1,
          { damping: 15 },
        );
        regionDropdownAnim.value = withTiming(0, { duration: 200 });
      }
    },
    [filterCategories, regionDropdownAnim, statusDropdownAnim],
  );

  // 필터 옵션 선택/해제
  const toggleFilterOption = useCallback(
    (categoryId: string, optionId: string) => {
      setSelectedFilters((prev) => {
        const categoryFilters = [...prev[categoryId]];
        const optionIndex = categoryFilters.indexOf(optionId);

        if (optionIndex >= 0) {
          categoryFilters.splice(optionIndex, 1);
        } else {
          categoryFilters.push(optionId);
        }

        const newFilters = {
          ...prev,
          [categoryId]: categoryFilters,
        };

        if (onSelectFilters) {
          onSelectFilters(categoryId, newFilters[categoryId]);
        }

        return newFilters;
      });
    },
    [onSelectFilters],
  );

  // 모든 필터 초기화
  const resetAllFilters = () => {
    setSelectedFilters({
      region: [],
      status: [],
    });

    if (onSelectFilters) {
      Object.keys(selectedFilters).forEach((categoryId) => {
        onSelectFilters(categoryId, []);
      });
    }
  };

  // 결과 적용
  const applyFilters = () => {
    // 드롭다운 닫기
    setFilterCategories((prev) =>
      prev.map((category) => ({
        ...category,
        isOpen: false,
      })),
    );

    // 애니메이션 적용
    regionDropdownAnim.value = withTiming(0, { duration: 200 });
    statusDropdownAnim.value = withTiming(0, { duration: 200 });

    if (onSelectFilters) {
      Object.entries(selectedFilters).forEach(([categoryId, options]) => {
        onSelectFilters(categoryId, options);
      });
    }
  };

  // 드롭다운 닫기
  const closeAllDropdowns = () => {
    setFilterCategories((prev) =>
      prev.map((category) => ({
        ...category,
        isOpen: false,
      })),
    );
    regionDropdownAnim.value = withTiming(0, { duration: 200 });
    statusDropdownAnim.value = withTiming(0, { duration: 200 });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filtersRow}>
        {/* 지역별 검색 필터 */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              borderColor: isDark ? "#555" : "#EDEDED",
              backgroundColor: isDark ? "#333" : "#fff",
            },
            filterCategories[0].isOpen && {
              backgroundColor: isDark ? "#444" : "#f0f0f0",
            },
            selectedFilters.region.length > 0 && {
              borderColor: "#FF6917",
              borderWidth: 1,
            },
          ]}
          onPress={() => toggleFilterCategory("region")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: isDark ? "#ddd" : "#767676" },
              selectedFilters.region.length > 0 && { color: "#FF6917" },
            ]}
          >
            {filterCategories[0].label}
            {selectedFilters.region.length > 0 &&
              ` (${selectedFilters.region.length})`}
          </Text>
          <Ionicons
            name={filterCategories[0].isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={
              selectedFilters.region.length > 0
                ? "#FF6917"
                : isDark
                ? "#ddd"
                : "#767676"
            }
          />
        </TouchableOpacity>

        {/* 진행 상태 필터 */}
        <TouchableOpacity
          style={[
            styles.filterChip,
            {
              borderColor: isDark ? "#555" : "#EDEDED",
              backgroundColor: isDark ? "#333" : "#fff",
            },
            filterCategories[1].isOpen && {
              backgroundColor: isDark ? "#444" : "#f0f0f0",
            },
            selectedFilters.status.length > 0 && {
              borderColor: "#FF6917",
              borderWidth: 1,
            },
          ]}
          onPress={() => toggleFilterCategory("status")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              { color: isDark ? "#ddd" : "#767676" },
              selectedFilters.status.length > 0 && { color: "#FF6917" },
            ]}
          >
            {filterCategories[1].label}
            {selectedFilters.status.length > 0 &&
              ` (${selectedFilters.status.length})`}
          </Text>
          <Ionicons
            name={filterCategories[1].isOpen ? "chevron-up" : "chevron-down"}
            size={16}
            color={
              selectedFilters.status.length > 0
                ? "#FF6917"
                : isDark
                ? "#ddd"
                : "#767676"
            }
          />
        </TouchableOpacity>

        {/* 내 주변 찾기 버튼 */}
        <TouchableOpacity
          style={[
            styles.locationChip,
            {
              backgroundColor: isDark ? "#333" : "#fff",
              borderColor: isDark ? "#555" : "#EDEDED",
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={14} color="#FF6917" />
          <Text style={styles.locationChipText}>내 주변 찾기</Text>
        </TouchableOpacity>
      </View>

      {/* 지역별 검색 드롭다운 */}
      <Animated.View style={[styles.dropdown, regionDropdownStyle]}>
        <View
          style={[
            styles.dropdownContent,
            { backgroundColor: isDark ? "#222" : "#F7F7F7" },
          ]}
        >
          <Text
            style={[
              styles.dropdownTitle,
              { color: isDark ? "#fff" : "#191919" },
            ]}
          >
            지역별 검색
          </Text>
          <ScrollView
            style={styles.optionsScrollView}
            contentContainerStyle={styles.optionsContainer}
          >
            {filterCategories[0].options.map((option) => {
              const isSelected = selectedFilters.region.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionChip,
                    {
                      borderColor: isDark ? "#555" : "#EDEDED",
                      backgroundColor: isSelected
                        ? "#FF6917"
                        : isDark
                        ? "#333"
                        : "#fff",
                    },
                  ]}
                  onPress={() => toggleFilterOption("region", option.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      {
                        color: isSelected
                          ? "#fff"
                          : isDark
                          ? "#ddd"
                          : "#767676",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.dropdownActions}>
            <TouchableOpacity onPress={resetAllFilters}>
              <Text
                style={[
                  styles.resetText,
                  { color: isDark ? "#aaa" : "#8B8B8B" },
                ]}
              >
                초기화
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters}>
              <Text style={styles.applyText}>결과 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* 진행 상태 드롭다운 */}
      <Animated.View style={[styles.dropdown, statusDropdownStyle]}>
        <View
          style={[
            styles.dropdownContent,
            { backgroundColor: isDark ? "#222" : "#F7F7F7" },
          ]}
        >
          <Text
            style={[
              styles.dropdownTitle,
              { color: isDark ? "#fff" : "#191919" },
            ]}
          >
            행사 진행 상태
          </Text>
          <ScrollView
            style={styles.optionsScrollView}
            contentContainerStyle={styles.optionsContainer}
          >
            {filterCategories[1].options.map((option) => {
              const isSelected = selectedFilters.status.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionChip,
                    {
                      borderColor: isDark ? "#555" : "#EDEDED",
                      backgroundColor: isSelected
                        ? "#FF6917"
                        : isDark
                        ? "#333"
                        : "#fff",
                    },
                  ]}
                  onPress={() => toggleFilterOption("status", option.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.optionChipText,
                      {
                        color: isSelected
                          ? "#fff"
                          : isDark
                          ? "#ddd"
                          : "#767676",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={styles.dropdownActions}>
            <TouchableOpacity onPress={resetAllFilters}>
              <Text
                style={[
                  styles.resetText,
                  { color: isDark ? "#aaa" : "#8B8B8B" },
                ]}
              >
                초기화
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={applyFilters}>
              <Text style={styles.applyText}>결과 보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* 배경 오버레이 (드롭다운이 활성화되었을 때) */}
      {(filterCategories[0].isOpen || filterCategories[1].isOpen) && (
        <Pressable style={styles.overlay} onPress={closeAllDropdowns} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 10,
  },
  filtersRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 21,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipText: {
    fontSize: 12,
    marginRight: 4,
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 21,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    marginLeft: "auto",
  },
  locationChipText: {
    fontSize: 12,
    color: "#FF6917",
    marginLeft: 4,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 100,
  },
  dropdownContent: {
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownTitle: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 8,
  },
  optionsScrollView: {
    maxHeight: 200, // 최대 높이 제한
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingBottom: 8,
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 21,
    borderWidth: 1,
  },
  optionChipText: {
    fontSize: 12,
    marginRight: 4,
  },
  dropdownActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  resetText: {
    fontSize: 16,
  },
  applyText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF6917",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
    zIndex: 50,
  },
});
