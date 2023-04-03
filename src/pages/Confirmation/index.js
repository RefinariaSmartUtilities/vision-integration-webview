import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { getData, storeData } from "../../services/storage";
import { Picker } from "@react-native-picker/picker";
import { makeID } from "../../services/makeID";
import mime from "mime";

export default function Confirmation({ route, navigation }) {
  const {
    code,
    imagem,
    instruments,
    routeTag,
    routeId,
    nwv,
    verification,
    selectedRoute,
  } = route.params;
  const [tag, setTag] = useState();
  const [allReads, setAllReads] = useState([]);
  const [read, setRead] = useState({ id: "", value: 0 });
  const [dataToSend, setDataToSend] = useState([])
  const [load, setLoad] = useState(false);
  const [selectVerification, setSelectVerification] = useState("Verificação");

  useEffect(() => {
    if (code === routeTag || code == "0") {
      setTag(routeTag);
    } else {
      Alert.alert(
        "Instrumento incorreto",
        "Este não é o instrumento correto. Por favor, capture novamente!",
        [
          {
            text: "Ok",
            onPress: () =>
              navigation.navigate("ReadPage", {
                routeTag: routeTag,
                instruments: instruments,
                routeId: routeId,
                nwv: nwv,
                selectedRoute: selectedRoute,
                verification: verification,
              }),
            style: "cancel",
          },
        ]
      );
    }
  }, []);

  const storageReads = () => {
    setAllReads([...allReads, { "id": read.id, "value": read.value }]);
    allReads.forEach((element) => {
      const indexFile = allReads.indexOf(element);
      if (String(element.id) === String(read.id) && String(element.id) !== "") {
        allReads.splice(indexFile, 1);
        setAllReads([...allReads, { "id": element.id, "value": element.value }]);
      }
      setAllReads([...allReads, { "id": read.id, "value": read.value }]);
    });
  }

  async function storage() {
    try {
      setLoad(true);

      const base64 =
        imagem === null
          ? ""
          : await FileSystem.readAsStringAsync(imagem, {
            encoding: "base64",
          });
      const filename = FileSystem.documentDirectory + `${tag}-${makeID(8)}.png`;
      const formatedFileName = filename.trim();
      await FileSystem.writeAsStringAsync(formatedFileName, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      getData(
        (data) => {
          if (selectVerification !== 'Verificação') {
            dataToSend.push({ tag: tag, read: selectVerification, type: imagem !== null ? mime.getType(imagem) : "", name: imagem !== null ? imagem.split("/").pop() : "", image: imagem !== null ? filename : {} })
          }
          else {
            allReads.forEach((read) => {
              if (tag !== '' && tag !== undefined && !verification) {
                dataToSend.push({ tag: read.id !== "" ? (tag + '-' + read.id) : tag, read: read.value, type: imagem !== null ? mime.getType(imagem) : "", name: imagem !== null ? imagem.split("/").pop() : "", image: imagem !== null ? filename : {} })
              }
            })
          }
          dataToSend.forEach((record) => {
            storeData(
              record,
              () => {
                setLoad(false);
                navigation.navigate("Finish", {
                  routeId: routeId,
                  selectedRoute: selectedRoute,
                });
              },
              () => {
                alert("Erro ao armazenar dados");
                console.log(error);
                setLoad(false);
              }
            );
          })
        },
        (error) => {
          alert("Erro ao carregar dados");
          console.log(error);
          setLoad(false);
        }
      );
    } catch (error) {
      console.log(error);
      setLoad(true);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Instrumento identificado</Text>
        <Text style={styles.input}>{tag}</Text>
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled={true}
        >
        {!verification &&
          instruments.map((instrument, index) => {
            return (
              <>
                <View style={styles.containerRead} key={index}>
                  {instruments[index] !== "" && instruments[index] !== "" ? (
                    <Text style={styles.readinstrument}>
                      {instruments[index]}
                    </Text>
                  ) : (
                    ""
                  )}
                  <TextInput
                    style={styles.inputRead}
                    placeholder="Inserir"
                    placeholderTextColor="#fff"
                    keyboardType="text"
                    onChangeText={(newValue) => setRead({ "id": instruments[index], "value": newValue })}
                    onEndEditing={storageReads}
                    id={instruments[index]}
                  />
                </View>
                <View style={styles.containerRead} key={instrument[index]}>
                  {nwv[index] !== "" && nwv[index] !== "-" ? (
                    <Text style={styles.readinstrument}>NWV: {nwv[index]}</Text>
                  ) : (
                    ""
                  )}
                </View>
              </>
            );
          })}
          </ScrollView>

        {verification && (
          <>
            <Text style={styles.readinstrument}>Verificação:</Text>
            <Picker
              style={{ width: 320 }}
              itemStyle={styles.inputVerification}
              dropdownIconColor="#2B7032"
              selectedValue={selectVerification}
              onValueChange={(item) => {
                setSelectVerification(item);
              }}
            >
              {instruments.map((state) => {
                return (
                  <Picker.Item
                    color="#fff"
                    style={styles.inputVerification}
                    label={state}
                    value={state}
                    key={state}
                  />
                );
              })}
            </Picker>
          </>
        )}

        <View style={styles.viewButtons}>
          <TouchableOpacity style={styles.buttons} onPress={storage}>
            <Image source={require("../../../assets/buttonConfirmation.png")} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() =>
              navigation.navigate("RoutePage", {
                routeTag: routeTag,
                instruments: instruments,
                routeId: routeId,
                nwv: nwv,
                selectedRoute: selectedRoute,
              })
            }
          >
            <Image source={require("../../../assets/buttonTryAgain.png")} />
          </TouchableOpacity>
        </View>
      </View>
      {load && (
        <Modal animationType="fade" transparent={true} visible={load}>
          <View style={styles.loadContainer}>
            <ActivityIndicator size="large" color="#2B7032" />
          </View>
        </Modal>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E2E2E",
    width: "100%",
    minHeight: "100%",
    padding: 15
  },
  containerRead: {
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#2E2E2E",
    display: "flex",
    flexDirection: "row",
    width: 320,
  },
  readinstrument: {
    color: "#fff",
    fontSize: 20,
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 5,
  },
  nwv: {
    color: "#fff",
    fontSize: 20,
    height: 55,
    minWidth: "5%",
    maxWidth: "50%",
    borderRadius: 12,
    textAlign: "center",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderStyle: "dotted",
    borderColor: "#2B7032",
  },
  text: {
    color: "#fff",
    fontSize: 25,
    padding: 10,
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
    marginBottom: 10,
  },
  inputRead: {
    backgroundColor: "#2E2E2E",
    borderWidth: 1,
    borderColor: "#2B7032",
    color: "#fff",
    fontSize: 20,
    minWidth: "30%",
    maxWidth: "50%",
    height: 55,
    borderRadius: 12,
    textAlign: "center",
    alignItems: "center",
    maxWidth: 320,
    padding: 10,
    marginTop: 20,
  },
  inputVerification: {
    backgroundColor: "#2E2E2E",
    borderWidth: 1,
    borderColor: "#2B7032",
    color: "#fff",
    fontSize: 20,
    height: 55,
    borderRadius: 12,
    textAlign: "center",
    alignItems: "center",
    width: 320,
    marginTop: 20,
  },
  viewButtons: {
    flexDirection: "row",
  },
  buttons: {
    alignItems: "center",
    padding: 25,
    paddingTop: 60,
  },
  loadContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2E2E2ECC",
  },
});
