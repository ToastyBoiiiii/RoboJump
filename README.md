# RoboJump Project
This project is the start of a 3D-Platformer.

## Bugs, suggestions and issues with the project
If you find any issues related to this project, don't be affraid to create an issue on GitHub to let me know.

## Running the Project
To install the modules you need node.js. You can get it from the [Node.js Website](https://nodejs.org/en). Then you need to execute the `node install` command.

### CORS
Currently there are still issues with CORS when trying to access the file server. This is why you need to install a browserplugin to circumvent this problem when running it.

### Running the project locally
To run it on your local machine, you need to first host the frontend with the command `npx vite` and for the backend you need to execute the command `node server.js`.

### Building the project
The project currently is not made for running it on a server. I still need to do some testing before I can provide an adequate tutorial on building it.
The biggest problem right now is that the fetch from the ResourceManager to the server and the non functional cors-allow is hardcoded to the localhost with specific ports.