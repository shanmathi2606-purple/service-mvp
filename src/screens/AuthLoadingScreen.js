import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../firebase";

export default function AuthLoadingScreen({ navigation }) {
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) navigation.replace("Home");
      else navigation.replace("Login");
    });
    return unsub;
  }, [navigation]);

  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
