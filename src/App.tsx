import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { studentData } from './dto';
const App: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string>(''); 
  const [studentName, setStudentName] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const objectUrl = URL.createObjectURL(file);
      console.log("objectUrl",objectUrl);
      
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL_BACKEND}/checkslip`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('Image uploaded successfully:', response.data);
        // alert('Slip uploaded successfully!');
        setImage(null);
        setPreview('https://cdn-icons-png.flaticon.com/512/5038/5038663.png');
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload slip. Try again.');
      }
    }
  };

  const handleStudentIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStudentId(e.target.value);
  };

  const handleStudentIdSubmit = async () => {
    if (studentId) {
      try {
        const data = await axios.get<studentData>(`${import.meta.env.VITE_URL_BACKEND}/student/${studentId}`);
        if (!data) {
          setStudentName(null);
        }
        setStudentName(data.data.firstName);
      } catch (error) {
        console.error('Error fetching student:', error);
      }
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // Full viewport height
      bgcolor: '#f5f5f5',
      margin: 0, // Ensure no extra margin/padding
      padding: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 400, padding: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Student Payment Verification
          </Typography>

          {/* Student ID Input */}
          <TextField
            label="Enter Student ID"
            value={studentId}
            onChange={handleStudentIdChange}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />

          <Button
            variant="contained"
            fullWidth
            color="primary"
            disabled={!studentId}
            onClick={handleStudentIdSubmit}
            sx={{ mb: 2 }}
          >
            Validate Student ID
          </Button>

          {/* Display student name if available */}
          {studentName && (
            <Typography variant="h6" align="center" color="textSecondary" gutterBottom>
              สวัสดี น้อง{studentName}
            </Typography>
          )}

          {/* File upload section */}
          {studentName && (
            <Box>
              <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                Upload Payment Slip
              </Typography>

              <Button
                variant="contained"
                component="label"
                fullWidth
                color="secondary"
                sx={{ mb: 2 }}
              >
                Choose Slip Image
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              {/* Image preview */}
              {preview && (
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <img src={preview} alt="Slip Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '4px' }} />
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                disabled={!image}
                onClick={handleSubmit}
              >
                Upload Slip
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default App;
