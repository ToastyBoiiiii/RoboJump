# RoboJump Project
This project is the start of a 3D-Platformer.

## Bugs, suggestions and issues with the project
If you find any issues related to this project, don't be afraid to create an issue on GitHub to let me know.

## Project ToDo-List
Obviously this project still has a lot of work which needs to be done. The following list includes the systems I am currently working on.
- Game Architecture
- [x] Input system
- [x] Scene manager
- [ ] Better loading screen interface
- [x] UI system
- [x] Object and script system
- [ ] Consider switching from node to deno
- Creative Decisions
- [x] Fix lighting
- [ ] Create interesting loading screen
- [ ] Robot SVG Icon for page (changing with dark mode)
- [ ] Interesting main menu

## Running the Project
To install the modules you need node.js. You can get it from the [Node.js Website](https://nodejs.org/en). Then you need to execute the `npm install` command.

### Running the project locally
To run the project use the command `npm run dev`.

### Building the project
The project currently is not made for running it on a server. I still need to do some testing before I can provide an adequate tutorial on building it.
The biggest problem right now is that the fetch from the ResourceManager to the server and the non functional cors-allow is hardcoded to the localhost with specific ports.
