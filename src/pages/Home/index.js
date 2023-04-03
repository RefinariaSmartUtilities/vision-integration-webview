import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { getData, storeData } from "../../services/storage";
import { callAPI } from "../../services/network";
import { UploadButton } from "../../components/uploadButton";
import route1 from "../../../assets/route-setor-1.json";
import route2 from "../../../assets/route-setor-2.json";
import route3 from "../../../assets/route-setor-3.json";
import route4 from "../../../assets/route-setor-4.json";
import { Opencv } from "../../components/webview";

export default function Home({ route, navigation }) {
  const [load, setLoad] = useState(true);
  const [localData, setLocalData] = useState([]);
  //const {routeId} = route.params
  const [routeId, setRouteId] = useState()
  const [actualRouteId, setActualRouteId] = useState()

  useEffect(() => {
    loadData();
    //routeId !== 0 && routeId !== undefined ? setActualRouteId(routeId) : setActualRouteId(0)
  }, []);

  useEffect(() => {
    loadData();
    const willFocusSubscription = navigation.addListener("focus", () => {
      loadData();
    });

    return willFocusSubscription;
  }, []);

  async function loadData() {
    getData(
      (data) => {
        setLocalData(data);
        setLoad(false);
      },
      (error) => {
        setLoad(false);
      }
    );
  }

  async function sendData() {
    let failures = [];
    let success = 0;
    let mistakes = 0;

    if (!(localData.length > 0)) {
      alert("Não existem registros armazenados para envio!");
      return;
    }

    setLoad(true);
    for (const record of localData) {
      const uri =
        Platform.OS === "ios"
          ? record.image.replace("file://", "")
          : record.image;
      const data = new FormData();
      data.append("tag", record.tag);
      data.append("read", record.read);
      data.append("file", {
        uri: uri,
        type: record.type,
        name: record.name,
        size: 2000,
      });

      await callAPI(
        "https://agrokit.herokuapp.com/refinaria",
        "POST",
        data,
        () => {
          success++;
        },
        (errorMessage) => {
          mistakes++;
          failures.push(record);
        }
      );
    }

    alert(
      `Processo finalizado! \n Dados enviados: ${success}\n Falhas: ${mistakes}`
    );

    storeData(
      failures,
      () => {
        console.log("Armazenamento atualizado");
      },
      () => {
        console.log("Falha na atualização do armazenamento");
      }
    );
    loadData();
  }

  return (
    <View style={styles.container}>
      <UploadButton load={load} counter={localData.length} onPress={sendData} />
      <Image source={require("../../../assets/logo.png")} style={styles.logo} />


      {/* arquivo de component para teste do open cv */}
      <Opencv/> 


      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          navigation.navigate("RoutePage", {
            routeId: 0,
            selectedRoute: route1,
          });
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>Setor 1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          navigation.navigate("RoutePage", {
            routeId: 0,
            selectedRoute: route2,
          });
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>Setor 2</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          navigation.navigate("RoutePage", {
            routeId: 0,
            selectedRoute: route3,
          });
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>Setor 3</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.startButton}
        onPress={() => {
          navigation.navigate("RoutePage", {
            routeId: 0,
            selectedRoute: route4,
          });
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20 }}>Setor 4</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E2E2E",
    justifyContent: "center",
    alignItems: "center",
  },
  startButton: {
    width: 250,
    height: 60,
    backgroundColor: "#2B7032",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  logo: {
    marginBottom: "15%"
  },
});
