import * as React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Home from "./src/pages/Home";
import Erro from "./src/pages/Erro";
import ReadPage from "./src/pages/ReadPage";
import Confirmation from "./src/pages/Confirmation";
import Finish from "./src/pages/Finish";
import RoutePage from "./src/pages/RoutePage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: "Smart Utilities",
              headerStyle: {
                backgroundColor: "#2B7032",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="ReadPage"
            component={ReadPage}
            options={{
              title: "",
              headerShown: false,
              headerTransparent: true,
            }}
          />
          <Stack.Screen
            name="Confirmation"
            component={Confirmation}
            options={{
              title: "Identificação",
              headerStyle: {
                backgroundColor: "#3B7032",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Finish"
            component={Finish}
            options={{
              title: "Etapa concluída",
              headerStyle: {
                backgroundColor: "#3B7032",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="Erro"
            component={Erro}
            options={{
              title: "Algo deu errado",
              headerStyle: {
                backgroundColor: "#3B7032",
              },
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="RoutePage"
            component={RoutePage}
            options={{
              title: "Próximo instrumento",
              headerStyle: {
                backgroundColor: "#3B7032",
              },
              headerTintColor: "#fff",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
