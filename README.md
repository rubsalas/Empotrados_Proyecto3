# Empotrados_Proyecto3

Tercer proyecto del curso de Sistemas Empotrados del primer semestre 2024 del Instituto Tecnológico de Costa Rica

## App

Se debe crear el proyecto del app con Expo, utilizando router.

```bash
npx create-expo-app@latest -e with-router
```

Ingresar en el prompt el nombre del app y esperar que se descarguen las dependencias.

Abrir el proyecto en algun editor de texto, aqui se utilizará Visual Studio Code.

```bash
code .
```

Se creará un folder "app" dentro del proyecto que incluirá los archivos más importnates del proyecto.

Dentro de este, se crean los respectivos archivos index.js y \_layout.js.

Se instalan un par de dependencias más

```bash
npm install axios react-native-dotenv
```

Para hacer un build y compilar la aplicación.

```bash
npm start
```

Para poder probar y utilizar la aplicación en modo de desarrollo se debe descargar la aplicación en el celular de [Expo Go](https://expo.dev/go) en Play Store o en el App Store.

Luego de haberla descargado, se debe leer el código QR que aparece en la terminal al correr el último comando. La computadora donde se está desarrollando la aplicación y el celular deben estar conectados a la misma red para que funcione.

Empezará a hacerse un Javascript bundle y finalmente se podrá ver la aplicación desarrollada en el celular.
