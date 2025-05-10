// ProductShowcase.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import BubbleCarousel from "./BubbleCarousel";
import { Menu, Provider } from "react-native-paper";
import { GestureHandlerRootView, TapGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ProductShowcase = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [mode, setMode] = useState("Outfits");
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const carouselRef = useRef(null);

  const triggerSelection = () => Haptics.selectionAsync();
  const triggerImpact = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleModeSelect = (newMode) => {
    setMode(newMode);
    triggerSelection();
    closeMenu();
  };

  const handleDoubleTap = ({ nativeEvent }) => {
    if (nativeEvent.state === State.ACTIVE) {
      setFullPreview((prev) => !prev);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider>
        <TapGestureHandler onHandlerStateChange={handleDoubleTap} numberOfTaps={2}>
          <View style={styles.flexContainer}>
            <ImageBackground
              source={require("@/assets/images/burger-hoodie.jpg")}
              style={styles.backgroundImage}
              resizeMode="cover"
            >
              {!fullPreview && (
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "rgba(0,0,0,1)"]}
                  style={styles.gradientOverlay}
                />
              )}

              {!fullPreview && (
                <>
                  {/* Header */}
                  <View style={styles.header}>
                    <TouchableOpacity style={styles.collectionSelector} onPress={triggerSelection}>
                      <Text style={styles.headerTitle}>Liked Collection</Text>
                      <Ionicons name="chevron-down" size={20} color="white" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                    <View style={styles.headerIcons}>
                      <TouchableOpacity style={styles.iconButton} onPress={triggerSelection}>
                        <Ionicons name="search-outline" size={24} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.iconButton} onPress={triggerSelection}>
                        <Ionicons name="create-outline" size={24} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Dropdown Menu for mode selection */}
                  <View style={styles.dropdownWrapper}>
                    <Menu
                      visible={menuVisible}
                      onDismiss={closeMenu}
                      anchor={
                        <TouchableOpacity onPress={openMenu} style={styles.dropdownAnchor}>
                          <Text style={styles.dropdownText}>{mode}</Text>
                          <Ionicons name="chevron-down" size={16} color="white" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                      }
                    >
                      <Menu.Item onPress={() => handleModeSelect("Outfits") } title="Outfits" />
                      <Menu.Item onPress={() => handleModeSelect("Clothes") } title="Clothes" />
                    </Menu>
                  </View>

                  {/* Carousel */}
                  <BubbleCarousel
                    ref={carouselRef}
                    scrollX={scrollX}
                    selectedIndex={selectedIndex}
                    setSelectedIndex={(index) => {
                      setSelectedIndex(index);
                      triggerImpact();
                    }}
                  />

                  {/* Item Info with modal trigger */}
                  <View style={styles.itemInfoBox}>
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Text style={styles.itemTitle}>Sample Jacket</Text>
                      <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Ionicons name="information-circle-outline" size={18} color="white" style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.itemSubtitle}>Streetwear Vibe</Text>
                  </View>

                  {/* Delete Button */}
                  <TouchableOpacity style={styles.deleteButton} onPress={triggerSelection}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>

                  {/* Action Buttons (right side) */}
                  <View style={styles.actionsPanel}>
                    <TouchableOpacity style={styles.actionButton} onPress={triggerSelection}>
                      <Ionicons name="shirt-outline" size={24} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton} onPress={triggerSelection}>
                      <Ionicons name="heart-outline" size={24} color="white" />
                    </TouchableOpacity>
                  </View>

                  {/* Nav Bar */}
                  <View style={styles.navBar}>
                    {["home", "storefront", "shirt", "person"].map((icon, i) => {
                      const isActive = i === 2;
                      return (
                        <TouchableOpacity
                          key={icon}
                          style={[styles.navItem, isActive && styles.navItemActive]}
                          onPress={triggerSelection}
                        >
                          <Ionicons name={`${icon}-outline`} size={24} color="white" />
                          <Text style={[styles.navLabel, isActive && styles.activeLabel]}>
                            {["Home", "Retailers", "Closet", "Profile"][i]}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              {/* Modal Info */}
              <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                  <View style={styles.modalBox}>
                    <Image source={require("@/assets/images/shirttt.png")} style={styles.modalImage} />
                    <Text style={styles.modalTitle}>Sample Jacket</Text>
                    <Text style={styles.modalText}>Brand: Open Wardrobe</Text>
                    <Text style={styles.modalText}>Material: 100% Cotton</Text>
                    <Text style={styles.modalText}>Fit: Relaxed</Text>
                    <Text style={styles.modalText}>Care: Machine Wash Cold</Text>
                  </View>
                </Pressable>
              </Modal>
            </ImageBackground>
          </View>
        </TapGestureHandler>
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "space-between",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 8,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  collectionSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 32,
    fontWeight: "600",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  dropdownWrapper: {
    position: "absolute",
    top: 90,
    left: 16,
  },
  dropdownAnchor: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dropdownText: {
    color: "white",
    fontSize: 14,
  },
  itemInfoBox: {
    position: "absolute",
    bottom: 80,
    left: 16,
  },
  itemTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  itemSubtitle: {
    color: "white",
    fontSize: 14,
  },
  deleteButton: {
    position: "absolute",
    bottom: 80,
    right: 16,
    padding: 8,
  },
  actionsPanel: {
    position: "absolute",
    top: height * 0.25,
    right: 10,
    gap: 20,
  },
  actionButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 4,
  },
  modalImage: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 10,
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 12,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 4,
  },
  navItemActive: {
    borderTopWidth: 2,
    borderTopColor: "white",
    paddingTop: 8,
  },
  activeLabel: {
    fontWeight: "bold",
  },
});

export default ProductShowcase;
