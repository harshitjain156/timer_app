import { useThemeContext } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const BackButton = () => {
    const{theme}=useThemeContext()
  return (
    <View>
      <TouchableOpacity
        style={[{ padding: 4, paddingRight: 8 ,}]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={22} color={theme!='light'?"#fff":"#000"} />
      </TouchableOpacity>
    </View>
  );
};

export default BackButton;
