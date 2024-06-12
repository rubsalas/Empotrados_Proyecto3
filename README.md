# Tercer proyecto del curso de Sistemas Empotrados del primer semestre 2024 del Instituto Tecnológico de Costa Rica

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

## Yocto

### Instrucciones de Configuración

1. Descomprima cada uno de los archivos ZIP en la carpeta `poky-dunfell`, con excepción del archivo `openembedded-dunfell`. Para este último, extraiga únicamente la carpeta `meta-oe` y colóquela en el directorio de `poky-dunfell`.

2. En la carpeta correspondiente a su máquina (en este ejemplo, `rpi3`), navegue a `conf` y edite el archivo `bblayers.conf` para que se vea así:

    ```conf
    # POKY_BBLAYERS_CONF_VERSION is increased each time build/conf/bblayers.conf
    # changes incompatibly
    POKY_BBLAYERS_CONF_VERSION = "2"

    BBPATH = "${TOPDIR}"
    BBFILES ?= ""

    BBLAYERS ?= " \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-poky \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-yocto-bsp \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-raspberrypi \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-atmel-dunfell \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-oe \
      /home/jsantamaria/Documents/poky-dunfell-23.0.31/meta-clang-dunfell\
    "
    ```

    **Nota:** Cambie las rutas según su configuración de directorios.

3. A continuación, edite el archivo `local.conf` para que se vea así:

    ```conf
    MACHINE ?= "raspberrypi3"
    INHERIT += "rm_work"
    DL_DIR ?= "/home/jsantamaria/Documents/poky-dunfell-23.0.31/downloads"

    IMAGE_INSTALL_append = " fswebcam \
        raspi-gpio \
        jansson\
        glibc\
        libmicrohttpd\
        rpi-gpio\
        python3-rtimu\
        rpio\
        openmp\
    "
    ```

    **Nota:** Asegúrese de cambiar la parte de `MACHINE` con `raspberrypi3` o la que corresponda a su configuración.

### Compilación de Recetas

1. Inicialice el ambiente de compilación en el directorio `poky-dunfell` ejecutando:

    ```sh
    . oe-init-build-env rpi3
    ```

    Debería ver que puede ejecutar `bitbake` y otros comandos relacionados.

2. Compile cada una de las recetas necesarias, por ejemplo:

    ```sh
    bitbake raspi-gpio
    ```

    Repita este paso para cada una de las recetas listadas en `IMAGE_INSTALL_append` de su `local.conf`.

3. Una vez compiladas todas las recetas, compile la imagen base:

    ```sh
    bitbake rpi-basic-image
    ```

### Creación de la Imagen

1. Entre al directorio de la imagen:

    ```sh
    cd tmp/deploy/images/raspberrypi3
    ```

2. Copie la imagen a su dispositivo usando `bmaptool`:

    ```sh
    sudo bmaptool copy rpi-basic-image-raspberrypi3.wic.bz2 /dev/sda
    ```

¡Y con esto debería tener su imagen lista para usarse!

