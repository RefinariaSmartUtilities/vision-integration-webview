import AsyncStorage from "@react-native-async-storage/async-storage";

export const getData = async (success, failure) => {
  try {
    const jsonValue = await AsyncStorage.getItem("@storedLocalData");
    success(jsonValue != null ? JSON.parse(jsonValue) : []);
  } catch (error) {
    failure(error);
  }
};

export const storeData = async (value, success, failure) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem("@storedLocalData", jsonValue);
    success();
    console.log('LEITURA ENVIADA:', jsonValue)
  } catch (error) {
    failure(error);
  }
};

/*
  A função clearData() limpa o armazenamento local
*/
export const clearData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {}
};

//Armazena o arquivo de rota no async storage e transforma em uma string
export const storeRoutes = async (selectedRoute) => {
  try {
    const jsonValue = JSON.stringify(selectedRoute);
    await AsyncStorage.setItem("@storedLocalRoutes", jsonValue);
  } catch {
    console.log("Não foi possível recuperar o arquivo");
  }
};

//Exporta as rotas e permite leitura transformando em um objeto iteravel
export const getRoutes = async () => {
  try {
    const exportRoute = await AsyncStorage.getItem("@storedLocalRoutes");
    const objectRoute = JSON.parse(exportRoute);
    return objectRoute;
  } catch {
    console.log("Não foi possível carregar a rota");
  }
};
