# Empotrados_Proyecto3
Tercer proyecto del curso de Sistemas Empotrados del primer semestre 2024 del Instituto Tecnológico de Costa Rica

En los zip, descomprima cada uno a excepcion del openembedded-dunfell, en la carpeta de poky-dunfell.
El de openembedded solo saque el que dice meta-oe, igual, todos los meta deben estar en el directorio de pokydunfell.x.x.x

En la carpeta de la maquina, en mi caso rpi3, no se como llamo la suya, vaya a al conf y luego al bblayers.conf en este se debe ver asi


#---bblayers.conf
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
  
# -------bblayers.conf
#Cambie las rutas a sus directorios

Ahora vaya al archivo local.conf

Y si debe ver asi
#-----local.conf
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
    
#-----Local.conf

#Edite la parte de MACHINE con si raspberrypi3 o la que haya puesto

Ahora se tienen que cocinar las recetas en el directorio de poky-dunfell.x.x.x realice la inicializacion del ambiente . oe-init-build-env #su_carpeta, le tiene que tirar que puede hacer bitbake y otros

$. oe-init-build-env rpi3

ahora tiene que cocinar cada receta

$bitbake raspi-gpio

Asi con cada una de las recetas, una vez que tenga todas entonces solo queda cocinar de nuevo la imagen en mi caso seria

$bitbake rpi-basic-image

Una vez realizada la imagen entonces solo queda copiarla

entre al directorio de la imagen en mi caso 

$cd tmp/deploy/images/raspberrypi3

Una vez ahi copie usando bmaptool la imagen

$sudo bmaptool copy rpi-basic-image-raspberrypi3.wic.bz2 /dev/sda

