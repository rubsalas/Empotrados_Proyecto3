#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <netinet/in.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <curl/curl.h>

#define PORT 8080
#define IMAGE_FILE "imagen.jpg"

void send_image() {
    CURL *curl;
    CURLcode res;

    curl_global_init(CURL_GLOBAL_DEFAULT);
    curl = curl_easy_init();

    if (curl) {
        struct curl_httppost *formpost = NULL;
        struct curl_httppost *lastptr = NULL;

        curl_formadd(&formpost,
                     &lastptr,
                     CURLFORM_COPYNAME, "image",
                     CURLFORM_FILE, IMAGE_FILE,
                     CURLFORM_END);

        curl_easy_setopt(curl, CURLOPT_URL, "http://localhost:5000/receive_image");
        curl_easy_setopt(curl, CURLOPT_HTTPPOST, formpost);

        res = curl_easy_perform(curl);
        if (res != CURLE_OK) {
            fprintf(stderr, "curl_easy_perform() failed: %s\n", curl_easy_strerror(res));
        }

        curl_easy_cleanup(curl);
        curl_formfree(formpost);
    }

    curl_global_cleanup();
}

void handle_request(int new_socket) {
    char buffer[8192] = {0};
    read(new_socket, buffer, 8192);

    char *method = strtok(buffer, " ");
    char *path = strtok(NULL, " ");
    char *protocol = strtok(NULL, "\r\n");

    if (strcmp(method, "GET") == 0 && strcmp(path, "/send_image") == 0) {
        send_image();

        char response[] = "HTTP/1.1 200 OK\r\n"
                          "Content-Type: text/plain\r\n"
                          "Content-Length: 17\r\n"
                          "\r\n"
                          "Image sent successfully!";
        write(new_socket, response, sizeof(response) - 1);
    } else {
        char response[] = "HTTP/1.1 404 Not Found\r\n"
                          "Content-Type: text/plain\r\n"
                          "Content-Length: 9\r\n"
                          "\r\n"
                          "Not Found";
        write(new_socket, response, sizeof(response) - 1);
    }
}

int main() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int addrlen = sizeof(address);

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        perror("socket failed");
        exit(EXIT_FAILURE);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) {
        perror("bind failed");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    if (listen(server_fd, 3) < 0) {
        perror("listen");
        close(server_fd);
        exit(EXIT_FAILURE);
    }

    while (1) {
        if ((new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen)) < 0) {
            perror("accept");
            close(server_fd);
            exit(EXIT_FAILURE);
        }

        handle_request(new_socket);
        close(new_socket);
    }

    return 0;
}

