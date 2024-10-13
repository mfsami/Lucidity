import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "563371152440-ksie13m8mk2fafj06c578m70gj3gov86.apps.googleusercontent.com",
    redirectUri: "https://auth.expo.io/@mfsam/Lucidity",
    scopes: ["profile", "email"],
  });

  // Function to handle your app's internal credentials validation
  function validateCredentials() {
    if (email && password) {
      // Mock check, you can add your actual app logic here
      Alert.alert("Credentials Validated", `Email: ${email}`);
      navigation.navigate("PopulateInfo");
    } else {
      Alert.alert("Error", "Please enter email and password.");
    }
  }

  // Fetch the user's info after successful Google sign-in
  async function fetchGoogleUserInfo(token) {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    let userInfo = await userInfoResponse.json();
    console.log(userInfo);
    Alert.alert("Google Login Success", `Hi, ${userInfo.name}`);
  }

  // Effect to check when Google login is successful
  React.useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      fetchGoogleUserInfo(authentication.accessToken);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}></View>
      <Text style={styles.loginHeader}>Login</Text>
      <View style={styles.rowOne}>
        <Input placeholder="Email" callback={setEmail} value={email} />
        <Input placeholder="Password" callback={setPassword} value={password} />
        <Button type="small" text="Continue" callback={validateCredentials} />
      </View>
      <View style={styles.rowTwo}>
        <View style={styles.divider}></View>
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.divider}></View>
      </View>
      <View style={styles.rowThree}>
        <Button
          type="medium"
          text="Sign in with Google"
          trailing="rightarrow"
          leading="google"
          callback={() => promptAsync()}
        />
        <Button
          type="medium"
          text="Sign in with LinkedIn"
          trailing="rightarrow"
          leading="linkedin"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    height: 100,
    width: 100,
    backgroundColor: "white",
    borderRadius: 24,
    opacity: 0.1,
    marginBottom: 24,
  },
  container: {
    // backgroundColor: "#0F0F0F",
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loginHeader: {
    fontSize: "25px",
    marginTop: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "white",
  },
  rowOne: {
    width: "100%",
    gap: 16,
    marginBottom: 16,
  },
  rowTwo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 10,
    marginVertical: 16,
  },
  divider: {
    backgroundColor: "#E5E7EB",
    height: 1,
    flex: 1,
    opacity: 0.4,
  },
  dividerText: {
    color: "#E5E7EB",
    fontSize: 14,
    paddingHorizontal: 10,
    opacity: 0.4,
  },
  rowThree: {
    width: "100%",
    gap: 10,
    marginTop: 16,
  },
  infoInputs: {
    backgroundColor: "#222",
  },
});
