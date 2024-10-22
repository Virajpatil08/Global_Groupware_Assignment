# Global Groupware Assignment

This is a React application built for user authentication and management using the Reqres API. The application supports features like login, user management, and data encryption for improved security.

## Features

- **User Login**: Secure login with email and password validation.
- **Remember Me**: Encrypts and stores user credentials securely using `crypto-js`.
- **User Management**: CRUD operations for users (add, edit, delete) with a clean, user-friendly UI.
- **Notifications**: Instant feedback using `react-toastify` for success and error messages.
- **Responsive Design**: Fully responsive for desktop and mobile devices.
- **Form Handling**: Uses Formik for easy form handling and validation.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **Formik**: For form handling and validation.
- **Yup**: For schema-based validation.
- **react-toastify**: For user notifications.
- **crypto-js**: For encrypting sensitive data (e.g., passwords).
- **Tailwind CSS**: For responsive styling.
- **Axios**: For making HTTP requests to the API.

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js**: [Download and Install](https://nodejs.org/)
- **npm** or **yarn**: Node package manager. It comes with Node.js, but you can also use Yarn if you prefer.

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Virajpatil08/Global_Groupware_Assignment.git
cd Global_Groupware_Assignment/employwise-assignment


npm install


.
├── public
│   ├── index.html
│   └── ...
├── src
│   ├── assets
│   │   └── login_image.jpg
│   ├── components
│   │   ├── UserList.js
│   │   └── Modal.js
│   ├── services
│   │   └── apiService.js
│   ├── pages
│   │   └── Login.js
│   ├── App.js
│   └── index.js
├── .env
├── package.json
└── README.md


### Additional Sections Added:
1. **Project Structure**: Gives an overview of how the project is organized.
2. **Deployment**: Instructions on creating a production build and deploying it on platforms like Netlify.
3. **Environment Variables**: Details on how to configure environment variables for flexibility.
4. **Troubleshooting**: Solutions to common problems that users might encounter.
5. **Future Enhancements**: Ideas for expanding the functionality and usability of the application.

These additions should make your `README.md` more comprehensive and user-friendly. Feel free to tweak it further according to your project specifics.
