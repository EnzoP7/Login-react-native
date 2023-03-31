import React, { useState, createContext, useContext, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";

import Chat from "./screens/Chat";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import { async } from "@firebase/util";
import { auth } from "./config/firebase";
const Stack = createStackNavigator();//Creamos Contexto
const AuthenticatedUserContext = createContext({});

//Creamos la funcion del Contexto
const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null); //para el usuario
  //Proveemos el user y el setuser
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

//Definimos el Stack.Navigator y dentro agregamos las Screen que queremos
function ChatStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Home}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}

//Lo mismo Aqui jejje
function AuthStack() {
  return (
    <Stack.Navigator defaultScreenOptions={Login} screenOptions={{headerShown:false}}>
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Login" component={Login} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  //Traemps el user y setuser del Contexto
  const { user, setUser } = useContext(AuthenticatedUserContext);
  //Creamos un Loading
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    //Creamos constante y llamamos a onAuthStateChanged que se le manda la Auth que es la data de el firebase 
    const unsubscribe = onAuthStateChanged(auth, async (AuthenticatedUser) => {
      //si el  AuthenticatedUser existe entonces que lo guarde sino que lo marque nullo
      AuthenticatedUser ? setUser(AuthenticatedUser) : setUser(null);
      setLoading(false);
    });
    //Esto es para que se quite este componente, tambien se quite el useeffect y no se corra de mas
    return () => unsubscribe();
  }, [user]);//cada vez que el userCambie
  if(loading){//al principio siempre esta cargando entonces devolvemos el activity Indicator
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  // Si el User Existe tucson lo pasamos la funcion que lo manda a tal lado, sino la otra xd
  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack/>}
     
    </NavigationContainer>
  );
}
export default function App() {
  
  //Envolvemos Todo Dentro del ContextoProvaider y somos Nosotros
  return (
<AuthenticatedUserProvider>
<RootNavigator />
</AuthenticatedUserProvider>

  );
}
