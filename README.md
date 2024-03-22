# Cloudinary upload-delete

## Overview

This project is a simple web application that allows users to upload and delete images from Cloudinary. It is built using Express.js for the server-side and Vue.js for the client-side. The application generates a delete token upon image upload, which is used to securely delete images from Cloudinary.

## Getting Started

### Prerequisites

- Node.js installed on your machine
- Cloudinary account with API credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd your-repository
   ```

3. **Install dependencies for both the server and client:**

   ```bash
   npm install
   
   ```

4. **Set up Cloudinary configuration:**
   
   - Create a `.env` file in the root directory of the project.
   - Add your Cloudinary credentials to the `.env` file:

     ```dotenv
     CLOUDINARY_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

5. **Start the server:**

   ```bash
   node server.js
   ```

6. **Start the client:**

   ```bash
   npm run serve
   ```

7. **Open your web browser and navigate to the provided URL to access the application.**

## Usage

- **Upload Images**: Users can upload images by selecting files from their local machine. Upon upload, a delete token is generated for each image, allowing users to securely delete them from Cloudinary.

- **Delete Images**: Users can delete uploaded images by clicking on the delete button associated with each image. This action securely deletes the image from Cloudinary.

## Technologies Used

- Express.js
- Vue.js
- Cloudinary

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
