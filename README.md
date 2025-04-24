# Student-Doctor
A web application for managing students and doctors information

## Features

- Add, edit, and delete students and doctors
- Search functionality for both students and doctors
- View all data in a single view
- Modern and responsive UI
- Real-time updates

## API Endpoints

### Students
- `POST /add-student` - Add a new student
- `POST /add-hardcoded-student` - Add a hardcoded student (for testing)
- `GET /fetch-students` - Get all students
- `PUT /update-student` - Update a student
- `DELETE /delete-student` - Delete a student
1 
### Doctors
- `POST /add-doctor` - Add a new doctor
- `GET /fetch-doctors` - Get all doctors
- `PUT /update-doctor` - Update a doctor
- `DELETE /delete-doctor` - Delete a doctor

### Combined
- `GET /fetch-all` - Get all students and doctors

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node app.js
   ```
4. Open `index.html` in your browser

## Technologies Used

- Frontend:
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - Bootstrap 5
  - Font Awesome

- Backend:
  - Node.js
  - Express.js
  - MongoDB

## License

MIT License
# Student-Doctor
