#include <stdio.h>
#include <stdlib.h>
#include <wiringPi.h>

#define TRIG_PIN 4
#define ECHO_PIN 5

void setup() {
    wiringPiSetup();
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    digitalWrite(TRIG_PIN, LOW);
    delay(30);
}

float get_distance() {
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);
    
    while (digitalRead(ECHO_PIN) == LOW);
    long startTime = micros();
    while (digitalRead(ECHO_PIN) == HIGH);
    long travelTime = micros() - startTime;
    
    float distance = travelTime / 58.0; //Convertime time to distance
    return distance;
}

int main() {
    setup();
    
    while (1) {
        float distance = get_distance();
        printf("Distancia medida: %.2f cm\n", distance);
        delay(1000); // Delay 1s
    }
    
    return 0;
}
