# Empotrados_Proyecto3

Tercer proyecto del curso de Sistemas Empotrados del primer semestre 2024 del Instituto Tecnológico de Costa Rica.

## Instrucciones de Configuración

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

## Compilación de Recetas

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

## Creación de la Imagen

1. Entre al directorio de la imagen:

    ```sh
    cd tmp/deploy/images/raspberrypi3
    ```

2. Copie la imagen a su dispositivo usando `bmaptool`:

    ```sh
    sudo bmaptool copy rpi-basic-image-raspberrypi3.wic.bz2 /dev/sda
    ```

¡Y con esto debería tener su imagen lista para usarse!

