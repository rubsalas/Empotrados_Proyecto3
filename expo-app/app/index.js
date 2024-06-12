import { useState } from 'react';
import { Alert, View, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS } from '../constants';

import SignInButton from '../components/buttons/SignInButton';

const LogInScreen = () => {
    const router = useRouter(); // Objeto de enrutamiento

    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para almacenar si el usuario está conectado

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Función para manejar el inicio de sesión
    const handleLogin = () => {
        // Verificar si el email y la contraseña coinciden con el usuario único
        if (email === 'admin@tec.ac.cr' && password === 'empotrados') {
            // Si coincide, navegar a la siguiente pantalla
            setIsLoggedIn(true);
            console.log('handleLogin successfull');
            return true;
        } else {
            setIsLoggedIn(false);
            // Si no coincide, mostrar una alerta
            //Alert.alert('Error', 'El email o la contraseña son incorrectos');
            console.log('handleLogin unsuccessfull');
            return false;
        }
    };

    const logIn = () => {
        // Se maneja el log in

        if (handleLogin()) {
            console.log("log in succesfull");
            router.navigate('/home'); // Navega a la pantalla 'Home' después del inicio de sesión exitoso
          } else {
            Alert.alert('Error', 'Log in failed');
            console.log("log in failed");
          }
      };


    return (
        <SafeAreaView style={styles.containerMain}>
            <Stack.Screen
                options={{
                    headerStyle: { backgroundColor: COLORS.white},
                    headerShadowVisible: false,
                    headerTitle: ""
                }}
            />
            <View style={styles.containerText}>
                <Text style={styles.title}>Security Cam</Text>
                <Text style={styles.subtitle}>Sign in to your account</Text>
                <TextInput
                    placeholder="beto@email.com"
                    style={styles.textInput}
                    onChangeText={text => setEmail(text)}
                    value={email}
                    />
                <TextInput
                    placeholder="password"
                    style={styles.textInput}
                    onChangeText={text => setPassword(text)}
                    value={password}
                    secureTextEntry={true}
                />
                <Text style={styles.textForgot}>Please don't forget your password</Text>
                {/* Button */}
                <View style={styles.containerButton}>
                    <SignInButton
                        buttonFunction={logIn}
                        text={"Log In"}
                    />
                </View>
                <Text style={styles.textLast}>CE1113 - Sistemas Empotrados - Proyecto 3</Text>
            </View>


        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    containerMain: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    containerButton: {
        width: '100%',
        display: "flex",
        alignItems: "center",
        marginTop: 60,
    },
    containerImage: {
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    containerText: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center'
    },  
    subtitle: {
        fontSize: 20,
        color: COLORS.gray
    },
    textForgot: {
        fontSize: 14,
        color: COLORS.gray,
        padding: 10,
        marginTop: 20,
    },
    textInput: {
        padding: 10,
        paddingStart: 30,
        width: '80%',
        height: 50,
        marginTop: 20,
        borderRadius: 30,
        backgroundColor: COLORS.lightWhite
    },
    textLast: {
        fontSize: 14,
        color: COLORS.gray,
        padding: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 65,
        color: COLORS.primary,
        fontWeight: 'bold',
        marginBottom: 60
    }
  });

export default LogInScreen;
