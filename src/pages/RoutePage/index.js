import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from "react-native";

import { storeRoutes, getRoutes } from "../../services/storage";

const getAllRoutes = async () => {
  const allRoutes = await getRoutes();
  return allRoutes;
};

export default function RoutePage({ route, navigation }) {
  const [tag, setTag] = useState();
  const [instrument, setInstrument] = useState([]);
  const [nwv, setNwv] = useState([]);
  const [verification, setVerification] = useState(false);
  const [endOfRoute, setEndOfRoute] = useState()
  const { routeId, selectedRoute } = route.params;

  useEffect(() => {
    storeRoutes(selectedRoute);
    getAllRoutes().then((route) => {
      setTag(route[routeId].tag);
      setInstrument(route[routeId].instrumentos);
      setNwv(route[routeId].nwv);
      setVerification(route[routeId].verification);
    });
    setEndOfRoute(selectedRoute.length)
  }, [routeId]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Próximo instrumento da rota:</Text>
        <Text style={styles.input}>{tag}</Text>
        <View style={styles.viewButtons}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              routeId == endOfRoute - 1 ?
                Alert.alert(
                  "Fim da rota",
                  "Você finalizou o percurso de coleta deste setor.",
                  [
                    {
                      text: "Ok",
                      onPress: () => navigation.navigate("Home"),
                      style: "cancel",
                    },
                  ]
                )
                :
                navigation.navigate("RoutePage", {
                  routeTag: tag,
                  instruments: instrument,
                  routeId: routeId + 1,
                  nwv: nwv,
                  selectedRoute: selectedRoute
                })
            }}
          >
            <Image source={require("../../../assets/x75.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() =>
              navigation.navigate("ReadPage", {
                routeTag: tag,
                instruments: instrument,
                routeId: routeId,
                nwv: nwv,
                selectedRoute: selectedRoute,
                verification: verification,
              })
            }
          >
            <Image source={require("../../../assets/buttonConfirmation.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() =>
              navigation.navigate("Confirmation", {
                code: "0",
                imagem: null,
                routeTag: tag,
                instruments: instrument,
                routeId: routeId,
                nwv: nwv,
                verification: verification,
                selectedRoute: selectedRoute
              })
            }
          >
            <Image source={require("../../../assets/buttonInsert.png")} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E2E2E",
  },
  text: {
    color: "#fff",
    fontSize: 25,
    paddingBottom: 50,
  },
  input: {
    backgroundColor: "#2B7032",
    color: "#fff",
    fontSize: 20,
    width: 320,
    height: 55,
    borderRadius: 12,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
  },
  viewButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
  },
  buttons: {
    alignItems: "center",
    padding: 25,
    paddingTop: 60,
  },
});
