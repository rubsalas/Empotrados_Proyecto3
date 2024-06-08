import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from '../../constants';

const SignInButton = ({ buttonFunction, text }) => {
    return (
    <TouchableOpacity onPress={buttonFunction} style={styles.button}>
        <Text style={styles.text}>
            {text}
        </Text>
    </TouchableOpacity>
)};

const styles = StyleSheet.create({
    button: {
      width: "35%",
      height: 50,
      backgroundColor: COLORS.primary,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    },
    text: {
      color: COLORS.fullWhite,
      fontSize: 20,
      fontWeight: "bold",
    },
  });

export default SignInButton;
