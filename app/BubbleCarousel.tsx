import React, { forwardRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  FlatList,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = 60;
const SPACER_SIZE = (width - ITEM_SIZE) / 2;

const clothes = [
  { key: "left-spacer" },
  ...Array(10).fill({}).map((_, i) => ({ key: `item-${i}` })),
  { key: "right-spacer" },
];

const BubbleCarousel = forwardRef(({ scrollX, selectedIndex, setSelectedIndex }, ref) => {
  return (
    <View style={styles.carouselWrapper}>
      <Animated.FlatList
        ref={ref}
        data={clothes}
        keyExtractor={(item) => item.key}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        snapToInterval={ITEM_SIZE}
        decelerationRate={"fast"}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(ev) => {
          const index = Math.round(ev.nativeEvent.contentOffset.x / ITEM_SIZE);
          setSelectedIndex(index);
        }}
        initialScrollIndex={1}
        getItemLayout={(data, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        renderItem={({ item, index }) => {
          if (item.key.includes("spacer")) {
            return <View style={{ width: SPACER_SIZE }} />;
          }

          const inputRange = [
            (index - 2) * ITEM_SIZE,
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
            (index + 2) * ITEM_SIZE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 0.85, 1.3, 0.85, 0.7],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 0.5, 1, 0.5, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[
                styles.bubbleAnimated,
                { transform: [{ scale }], opacity },
              ]}
            >
              <Image
                source={require("@/assets/images/shirttt.png")}
                style={styles.bubbleImage}
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  carouselWrapper: {
    position: "absolute",
    bottom: 130,
    width: "100%",
    height: 110,
  },
  bubbleAnimated: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    borderRadius: ITEM_SIZE / 2,
    backgroundColor: "transparent",
    marginHorizontal: 4,
    borderColor: "white", //#EA9F5A
    borderWidth: 3,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  bubbleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default BubbleCarousel;
