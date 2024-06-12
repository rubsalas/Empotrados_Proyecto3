#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <microhttpd.h>
#include <sys/stat.h>
#include <errno.h>
#include <jansson.h>

#define PORT 8888
#define IP_ADDRESS "192.168.50.180"
#define FILENAME "current_time.txt"
#define IMAGE_DIR "images"
#define IMAGE_FILE "images/capture.jpg"
#define IMAGE_URL_FILE "image_url.txt"
#define CAMERA_DEVICE "/dev/video2"
#define IMGUR_UPLOAD_COMMAND "curl -s -H 'Authorization: Client-ID b50f7ce78eda865' -F 'image=@%s' https://api.imgur.com/3/image"

static char last_image_url[1024] = {0};

static int handler(void *cls, struct MHD_Connection *connection,
                   const char *url, const char *method, const char *version,
                   const char *upload_data, size_t *upload_data_size, void **con_cls) {
    struct MHD_Response *response;
    int ret;

    // Print the received HTTP request
    printf("Received HTTP request:\n");
    printf("Method: %s\n", method);
    printf("URL: %s\n", url);
    printf("HTTP Version: %s\n", version);

    // Handle POST request to /sensor
    if (strcmp(method, "POST") == 0 && strcmp(url, "/sensor") == 0) {
        // Get the current time and convert it to a string using ctime
        time_t now = time(NULL);
        char *time_str = ctime(&now);

        // Remove the newline character added by ctime
        time_str[strlen(time_str) - 1] = '\0';

        // Open the file to overwrite the current time
        FILE *file = fopen(FILENAME, "w");
        if (file == NULL) {
            const char *error_msg = "Failed to open file.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }
        fprintf(file, "%s", time_str);
        fclose(file);

        // Send the HTTP response confirming the write to the file
        const char *success_msg = "Time written to file successfully.";
        response = MHD_create_response_from_buffer(strlen(success_msg), (void *)success_msg, MHD_RESPMEM_PERSISTENT);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }

    // Handle GET request to /time
    if (strcmp(method, "GET") == 0 && strcmp(url, "/time") == 0) {
        // Get the current time and convert it to a string using ctime
        time_t now = time(NULL);
        char *time_str = ctime(&now);

        // Remove the newline character added by ctime
        time_str[strlen(time_str) - 1] = '\0';

        // Print the current time on the server terminal
        printf("Current time: %s\n", time_str);

        // Send the HTTP response with the current time as a simple string
        response = MHD_create_response_from_buffer(strlen(time_str), (void *)time_str, MHD_RESPMEM_PERSISTENT);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }

    // Handle GET request to /sensor
    if (strcmp(method, "GET") == 0 && strcmp(url, "/sensor") == 0) {
        // Read the content of the file
        FILE *file = fopen(FILENAME, "r");
        if (file == NULL) {
            const char *error_msg = "Failed to open file.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }
        char file_content[256];
        memset(file_content, 0, sizeof(file_content)); // Initialize the buffer
        if (fgets(file_content, sizeof(file_content), file) == NULL) {
            const char *error_msg = "Failed to read file.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            fclose(file);
            return ret;
        }
        fclose(file);

        // Send the HTTP response with the content of the file directly
        response = MHD_create_response_from_buffer(strlen(file_content), (void *)file_content, MHD_RESPMEM_MUST_COPY);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        return ret;
    }

    // Handle POST request to /picture
    if (strcmp(method, "POST") == 0 && strcmp(url, "/picture") == 0) {
        // Create the image directory if it does not exist
        if (mkdir(IMAGE_DIR, 0777) != 0 && errno != EEXIST) {
            const char *error_msg = "Failed to create image directory.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }

        printf("Capturing image\n");
        char capture_command[256];
        snprintf(capture_command, sizeof(capture_command), "fswebcam -d %s -r 640x480 --jpeg 85 -D 1 %s", CAMERA_DEVICE, IMAGE_FILE);
        int system_ret = system(capture_command); // Capture the image with fswebcam
        if (system_ret != 0) {
            const char *error_msg = "Failed to capture image.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }
        printf("Image captured\n");

        // Upload the image to Imgur using curl and capture the response
        char upload_command[512];
        snprintf(upload_command, sizeof(upload_command), IMGUR_UPLOAD_COMMAND, IMAGE_FILE);
        FILE *upload_fp = popen(upload_command, "r");
        if (upload_fp == NULL) {
            const char *error_msg = "Failed to upload image to Imgur.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }

        char upload_response[1024];
        memset(upload_response, 0, sizeof(upload_response));
        fread(upload_response, 1, sizeof(upload_response) - 1, upload_fp);
        pclose(upload_fp);

        // Extract the image URL from the response
        char *image_url_start = strstr(upload_response, "\"link\":\"");
        if (image_url_start == NULL) {
            const char *error_msg = "Failed to parse Imgur response.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }
        image_url_start += strlen("\"link\":\"");
        char *image_url_end = strchr(image_url_start, '\"');
        if (image_url_end == NULL) {
            const char *error_msg = "Failed to parse Imgur response.";
            response = MHD_create_response_from_buffer(strlen(error_msg), (void *)error_msg, MHD_RESPMEM_PERSISTENT);
            ret = MHD_queue_response(connection, MHD_HTTP_INTERNAL_SERVER_ERROR, response);
            MHD_destroy_response(response);
            return ret;
        }
        *image_url_end = '\0';

        // Store the image URL
        strncpy(last_image_url, image_url_start, sizeof(last_image_url) - 1);

        // Save the image URL to a file
        FILE *url_file = fopen(IMAGE_URL_FILE, "w");
        if (url_file != NULL) {
            fprintf(url_file, "%s", last_image_url);
            fclose(url_file);
        }

        // Create a JSON object with the image URL
        json_t *json_response = json_object();
        json_object_set_new(json_response, "link", json_string(last_image_url));
        char *json_response_str = json_dumps(json_response, 0);
        json_decref(json_response);

        printf("Image uploaded to Imgur: %s\n", last_image_url);

        // Send the HTTP response with the JSON containing the image URL
        response = MHD_create_response_from_buffer(strlen(json_response_str), (void *)json_response_str, MHD_RESPMEM_MUST_COPY);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        free(json_response_str);
        return ret;
    }

    // Handle GET request to /picture
    if (strcmp(method, "GET") == 0 && strcmp(url, "/picture") == 0) {
        // Read the last image URL from the file
        FILE *url_file = fopen(IMAGE_URL_FILE, "r");
        if (url_file != NULL) {
            memset(last_image_url, 0, sizeof(last_image_url));
            fgets(last_image_url, sizeof(last_image_url), url_file);
            fclose(url_file);
        }

        // Create a JSON object with the image URL
        json_t *json_response = json_object();
        json_object_set_new(json_response, "link", json_string(last_image_url));
        char *json_response_str = json_dumps(json_response, 0);
        json_decref(json_response);

        printf("Returning last uploaded image URL: %s\n", last_image_url);

        // Send the HTTP response with the JSON containing the image URL
        response = MHD_create_response_from_buffer(strlen(json_response_str), (void *)json_response_str, MHD_RESPMEM_MUST_COPY);
        ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);
        free(json_response_str);
        return ret;
    }

    // If the method is not GET to /time or /sensor or /picture or POST to /sensor or /picture, return method not allowed
    const char *page = "Only GET to /time or /sensor or /picture or POST to /sensor or /picture is supported.";
    response = MHD_create_response_from_buffer(strlen(page), (void *)page, MHD_RESPMEM_PERSISTENT);
    ret = MHD_queue_response(connection, MHD_HTTP_METHOD_NOT_ALLOWED, response);
    MHD_destroy_response(response);
    return ret;
}

int main() {
    struct MHD_Daemon *daemon;

    daemon = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, PORT, NULL, NULL, &handler, NULL, MHD_OPTION_END);
    if (NULL == daemon) return 1;

    printf("Server is running on %s:%d\n", IP_ADDRESS, PORT);

    (void) getchar(); // Wait for the user to press Enter to stop the server

    MHD_stop_daemon(daemon);
    return 0;
}

