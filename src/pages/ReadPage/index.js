import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import MaskSvg from "../Mask";
import { BarCodeScanner } from "expo-barcode-scanner";
import { recortaManometro } from "../../services/vision";

export default function PageA({ route, navigation }) {
  const [type] = useState(Camera.Constants.Type.back); //state para definir câmera traseira ou frontal
  const [hasPermission, setHasPermission] = useState(null); //state para permitir uso da câmera
  const camRef = useRef(null); //referenciando a camera
  const [capturedPhoto, setCapturedPhoto] = useState(null); //state para controlar captura de imagem
  const [open, setOpen] = useState(false); //state para controlar o modal de exibição
  const [code, setCode] = useState("");
  const [cornerPoints, setCornerPoints] = useState();
  const [qrSize, setQrSize] = useState();
  const [feedbackImage, setFeedbackImage] = useState();
  const [angle, setAngle] = useState();
  const { routeTag, instruments, routeId, nwv, selectedRoute, verification } =
    route.params;

  useEffect(() => {
    // useEffect = 1ª vez que é executado o app
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Acesso a câmera negado!</Text>;
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri); //guardando a foto tirada
      console.log("captura", data);
      scanCode(data.uri);
      getCodePoints(data.uri);
      getCodeSyze(data.uri);
      const img_result = await recortaManometro(
        data.uri,
        cornerPoints[0],
        cornerPoints[1],
        cornerPoints[2],
        cornerPoints[3],
        qrSize
      );
      console.log("feedback", img_result);
      setFeedbackImage(img_result);
      setOpen(true);
    }
  }

  async function getCodePoints(image) {
    await BarCodeScanner.scanFromURLAsync(image, [
      BarCodeScanner.Constants.BarCodeType.qr,
    ])
      .then((response) => {
        const formatCornerPoints = response[0].cornerPoints.map(item => [item.x, item.y])
        setCornerPoints(formatCornerPoints);
      })
      .catch((error) => {
        console.log("Não foi possível extrair os pontos");
      });
  }

  async function getCodeSyze(image) {
    await BarCodeScanner.scanFromURLAsync(image, [
      BarCodeScanner.Constants.BarCodeType.qr,
    ])
      .then((response) => {
        const qrArea =
          response[0].bounds.size.height * response[0].bounds.size.width;
        setQrSize(qrArea);
      })
      .catch((error) => {
        console.log("Não foi possível extrair o tamanho");
      });
  }

  /*async function getVisionRead(img, cornerPoints, qrCodeSize) {
    const result_img = recortaManometro(
      img,
      [1134, 1448],
      [1302, 1490],
      [1122, 1623],
      [1292, 1663],
      qrCodeSize
    );
    return result_img;
  }*/

  async function savePicture() {
    const asset = await MediaLibrary.createAssetAsync(capturedPhoto)
      .then(() => {
        setOpen(false);
        navigation.navigate("Confirmation", {
          code: code,
          imagem: capturedPhoto,
          routeTag: routeTag,
          instruments: instruments,
          routeId: routeId,
          nwv: nwv,
          selectedRoute: selectedRoute,
          verification: verification,
          feedbackImage: feedbackImage,
          //angle: angle
        });
      })
      .catch((error) => {
        console.log("erro", error);
        Alert.alert("Ops!", "Ocorreu um erro, tente novamente!", [
          {
            text: "Ok",
            style: "cancel",
          },
        ]);
      });
  }

  async function scanCode(image) {
    await BarCodeScanner.scanFromURLAsync(image, [
      BarCodeScanner.Constants.BarCodeType.qr,
    ])
      .then((response) => {
        if (response.length === 1) {
          setCode(response[0].data);
        } else if (response.length === 0) {
          handleError("Nenhum qr code foi detectado!");
        } else {
          handleError(
            "Existe mais de um equipamento na imagem, tente tirar uma nova foto."
          );
        }
      })
      .catch((error) => {
        handleError("Não foi possível processar a imagem!");
      });
  }

  function handleError(message) {
    setOpen(false);
    setCapturedPhoto(null);
    alert(message);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={styles.camera} type={type} ref={camRef} />

      <MaskSvg />

      <Text style={styles.instruction}>
        Posicione o instrumento e o QR Code:
      </Text>

      <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
        <Image
          source={require("../../../assets/capture.png")}
          style={styles.captureButton}
        />
      </TouchableOpacity>

      {feedbackImage && (
        <Modal animationType="slide" transparent={false} visible={open}>
          <View style={styles.modal}>
            <Image style={styles.image} source={{ uri: capturedPhoto }} />
            <View style={styles.iconsModal}>
              <TouchableOpacity
                style={styles.iconsModalButtons}
                onPress={() => setOpen(false)}
              >
                <Image source={require("../../../assets/x.png")} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconsModalButtons}
                onPress={savePicture}
              >
                <Image source={require("../../../assets/v.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    flex: 1,
    position: "absolute",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  captureButton: {
    width: 90,
    height: 84,
  },
  takePictureButton: {
    justifyContent: "center",
    position: "absolute",
    top: "85%",
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2E2E2E",
  },
  image: {
    width: "95%",
    height: "80%",
    borderRadius: 15,
  },
  iconsModal: {
    marginTop: 25,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconsModalButtons: {
    marginHorizontal: 50,
  },
  instruction: {
    position: "absolute",
    top: 60,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    backgroundColor: "#3B7132",
    padding: 10,
    borderRadius: 5,
    color: "white",
  },
});
