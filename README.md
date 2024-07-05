# MERN Stack Blog Application

## Overview

Welcome to the MERN Stack Blog Application! This project is a full-fledged blog platform built using the MERN stack (MongoDB, Express, React, Node.js), with several modern features to enhance user experience and security. The application includes JWT authentication, React Redux for state management, Firebase for additional backend services, Tailwind CSS for styling, and Google OAuth integration for seamless user authentication.

## Features

### Authentication & Security
- **JWT Authentication**: Ensures secure access to protected routes.
- **Google OAuth**: Enables users to log in using their Google accounts.
- **Protected Routes**: Secures specific pages, such as the admin dashboard.

### Admin Dashboard
- **Post Management**: Admins can create, read, update, and delete posts.
- **Comment Management**: Admins have the ability to manage user comments.
- **User Management**: Admins can oversee user activities and manage user accounts.

### User Interaction
- **Commenting System**: Users can leave, edit, and delete comments on posts.
- **Interactive Community**: Encourages user interaction and engagement through comments.

### Search Functionality
- **Advanced Search**: Users can search for posts by title, limit results, and sort through a modern sidebar.
- **MongoDB Search Queries**: Utilizes advanced search techniques to provide fast and relevant search results.

### Design & Responsiveness
- **Responsive Design**: Ensures a seamless experience across various devices.
- **Dark Mode**: Provides a sleek dark mode to cater to user preferences.
- **Tailwind CSS**: Enhances the overall look and feel with modern, responsive design elements.

## Technologies Used

### Frontend
- **React**: For building user interfaces.
- **Vite**: For fast and optimized development.
- **React Redux**: For state management.
- **Tailwind CSS**: For styling.
- **Firebase**: For additional backend services.
- **Google OAuth**: For authentication.

### Backend
- **Node.js**: For server-side operations.
- **Express**: For building RESTful APIs.
- **MongoDB**: For the database.
- **JWT**: For securing API endpoints.

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Firebase account
- Google Developer account

### Installation

1. **Clone the repository:**
    ```
    git clone https://github.com/DevZiaus/mern-stack-blog.git
    cd mern-stack-blog
    ```

2. **Install dependencies for both client and server:**
    ```
    # Install server dependencies
    cd api
    npm install

    # Install client dependencies
    cd client
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env` file in the `root` of the project:
    ```
    PORT=3000
    ONLINE_MONGODB= your_ONLINE_mongodb_connection_string
    LOCAL_MONGODB = your_ONLINE_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

    Create a `.env` file in the `client` directory and add the following:
    ```
    VITE_FIREBASE_API_KEY = your_firebase_api_key
    ```

4. **Run the application:**

    Start the server:
    ```
    cd api
    npm run dev
    ```

    Start the client using Vite:
    ```
    cd client
    npm run dev
    ```

5. **Access the application:**
    Open your browser and navigate to `http://localhost:5173`.

## Usage

### Admin Dashboard
Admins can log in to the admin dashboard to manage posts, comments, and users. The dashboard provides an intuitive interface for performing CRUD operations.

### Searching Posts
Users can utilize the advanced search functionality to find posts by title, limit the number of results, and sort through a modern sidebar.

### Commenting
Users can engage with posts by leaving, editing, and deleting comments, fostering an interactive community.

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes. Ensure your code follows the project's style and passes all tests.

## License

This project is licensed under the MIT License.

---

Feel free to reach out if you have any questions or need further assistance. Enjoy using the MERN Stack Blog Application!

---

## Future Enhancements

- **Real-time Notifications**: Notify users of new comments or posts.
- **User Profiles**: Enhance user interaction by adding customizable user profiles.
- **Social Media Sharing**: Enable users to share posts on various social media platforms.
- **Markdown Support**: Allow posts and comments to be formatted using Markdown.

---

**a.** Add unit tests to the backend for CRUD operations.  
**b.** Integrate real-time notifications for new comments.