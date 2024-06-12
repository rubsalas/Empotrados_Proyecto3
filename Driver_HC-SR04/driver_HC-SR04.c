#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>
#include <time.h>

#define TRIG_PIN 4 // GPIO 23
#define ECHO_PIN 5 // GPIO 24
#define ALERT_DISTANCE 20.0 // Distancia en cm para generar alerta

void setup();
double getDistance();
void alert(double distance);
void delayMicrosecondsHard(unsigned int howLong);

void setup() {
    wiringPiSetup();
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    digitalWrite(TRIG_PIN, LOW);
    delay(30);
}

double getDistance() {
    // Enviar pulso
    digitalWrite(TRIG_PIN, HIGH);
    delayMicrosecondsHard(10);
    digitalWrite(TRIG_PIN, LOW);

    // Esperar a que el pulso de respuesta empiece
    while(digitalRead(ECHO_PIN) == LOW);

    // Medir la duración del pulso de respuesta
    struct timespec start, end;
    clock_gettime(CLOCK_MONOTONIC, &start);
    while(digitalRead(ECHO_PIN) == HIGH);
    clock_gettime(CLOCK_MONOTONIC, &end);

    // Calcular la duración del pulso en microsegundos
    double pulseDuration = (end.tv_sec - start.tv_sec) * 1e6 + (end.tv_nsec - start.tv_nsec) / 1e3;

    // Calcular la distancia en cm
    double distance = pulseDuration / 58.0;

    return distance;
}

void alert(double distance) {
    if (distance < ALERT_DISTANCE) {
        printf("¡Alerta! Objeto detectado a menos de %.2f cm\n", ALERT_DISTANCE);
    }
}

void delayMicrosecondsHard(unsigned int howLong) {
    struct timespec sleeper;
    unsigned int uSecs = howLong % 1000000;
    unsigned int wSecs = howLong / 1000000;

    sleeper.tv_sec = wSecs;
    sleeper.tv_nsec = (long)(uSecs * 1000L);
    nanosleep(&sleeper, NULL);
}

int main() {
    setup();

    while (1) {
        double distance = getDistance();
        printf("Distancia: %.2f cm\n", distance);
        alert(distance);

        delay(1000); // Esperar 1 segundo antes de la siguiente medición
    }

    return 0;
}


