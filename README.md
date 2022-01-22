<div id="top"></div>
<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h2 align="center">homely-surveillance</h2>

  <p align="center">
    Home surveillance from entry-door to in-house activities
    <br />
</div>


<!-- ABOUT THE PROJECT -->
## About The Project

Due to the wide range of applications in a variety of industries such as abnormal event detection, face detection, and intruder detection, recognizing and identifying objects from video collected from a surveillance system has gained greater attention. This is an example of a project that aims to automate the work of home surveillance.

![image](https://user-images.githubusercontent.com/31798732/150653808-8f7dd0b1-0438-4bb8-b019-8dcbcc25e36b.png)


Here's what we've implemented:
* Doorbell Surveillance
    1) Face recognition at the doorstep
    2) Real-time video communication with the homeowner
* Indoor Surveillance
    1) Fire detection
    2) Motion/intruder detection

Of course, this is not the most optimized model that could exist, but we're trying showcase that these models require very minimum compute power and could harness on-chip solutions such as face-api built on TensorFlow Lite and browser-based WebRTC API.

### System Architecture

The system design we coughed up and the fascinating visual graphic 😁

![image](https://user-images.githubusercontent.com/31798732/150654499-5e36882c-4960-4cde-80f6-9f6208edb429.png)

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Node.js](https://nodejs.org/en/)
* [Express.js](https://expressjs.com/)
* [Mongoose](https://mongoosejs.com/)
* [Passport.js](https://www.passportjs.org/)
* [Socket.IO](https://socket.io/)
* [WebRTC](https://webrtc.org/)
* [Bootstrap](https://getbootstrap.com)
* [EJS](https://ejs.co/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Follow the below steps to get a local testing environment for your application:

Install the latest Node.js LTS from [here](https://nodejs.org/en/download/).  
Install the MongoDB Community Server for your OS by following the installation guide from [here](https://docs.mongodb.com/manual/installation/).  

### Installation

1. Clone this repository into your local project directory.
   ```sh
   git clone https://github.com/dhruvshettty/homely-surveillance.git
   ```
2. Install NPM packages from your local project directory.
   ```sh
   npm install
   ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
**Case 1) When a user is recognized and authenticated successfully**

![image](https://user-images.githubusercontent.com/31798732/150654935-a92f63cc-5ff4-4864-9ee2-10a19dbca04b.png)

![image](https://user-images.githubusercontent.com/31798732/150654948-34a7033d-099f-400c-84a8-5ebccf17c05e.png)

**Case 2) When a user is not recognized and a real-time communication feed is initiated**

![image](https://user-images.githubusercontent.com/31798732/150655014-f30cc904-9b4f-409f-9b92-7701bf4392b3.png)

![image](https://user-images.githubusercontent.com/31798732/150655020-b69192ee-437f-4996-bfb8-52c5193c86c3.png)

Video demonstration can be found [here](https://drive.google.com/file/d/1tXv3VTI6AtHhBaWTC2DjTVAAqnEX5Jp4/view?usp=sharing).

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTRIBUTING -->
## Contributing

Any contributions you make are **greatly appreciated**. See `CONTRIBUTING.md` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [face-api.js](https://justadudewhohacks.github.io/face-api.js/docs/index.html)
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [ESLint - Pluggable JavaScript linter](https://www.notion.so/ESLint-Pluggable-JavaScript-linter-325d79bd7ef34f0a8916a22727fa2491)
* [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
* [GitHub Docs](https://docs.github.com/en)
* [How To Contribute To An Open Source Project On GitHub](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)
* [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

<p align="right">(<a href="#top">back to top</a>)</p>
