import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect } from "react";

export default function Finish({ route, navigation }) {
  const { routeId, selectedRoute } = route.params;
  let iterator = routeId;

  useEffect(() => {
    iterator++;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textIdentification}>
        Registro armazenado com sucesso!
      </Text>

      <View style={styles.viewButtons}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => {
            if (iterator === selectedRoute.length) {
              routeId == selectedRoute.lenght;
              Alert.alert(
                "Fim da rota",
                "Você finalizou o percurso de coleta deste setor.",
                [
                  {
                    text: "Ok",
                    onPress: () =>
                      navigation.navigate("Home", {
                        routeId: iterator,
                        selectedRoute,
                      }),
                    style: "cancel",
                  },
                ]
              );
            } else {
              navigation.navigate("RoutePage", {
                routeId: iterator,
                selectedRoute,
              });
            }
          }}
        >
          <Image source={require("../../../assets/buttonConfirmation.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
  },
  text: {
    color: "#fff",
    fontSize: 25,
    margin: 50,
  },
  textIdentification: {
    backgroundColor: "#2B7032",
    color: "#fff",
    fontSize: 20,
    margin: 50,
    width: 320,
    height: 150,
    borderRadius: 12,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 37,
  },
  viewButtons: {
    flexDirection: "row",
  },
  buttons: {
    margin: 50,
  },
});
