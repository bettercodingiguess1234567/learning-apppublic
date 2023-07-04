import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button, Grid } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import AspectRatio from '@mui/joy/AspectRatio';

function EditTutorial() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [tutorial, setTutorial] = useState({
        title: '',
        description: ''
    });

    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        http.get(`/tutorial/${id}`)
            .then((res) => {
                setTutorial(res.data);
                setImageFile(res.data.imageFile);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }
            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    const formik = useFormik({
        initialValues: tutorial,
        enableReinitialize: true,
        validationSchema: yup.object().shape({
            title: yup.string().trim()
                .min(3, 'Title must be at least 3 characters')
                .max(100, 'Title must be at most 100 characters')
                .required('Title is required'),
            description: yup.string().trim()
                .min(3, 'Description must be at least 3 characters')
                .max(500, 'Description must be at most 500 characters')
                .required('Description is required')
        }),
        onSubmit: (data) => {
            data.title = data.title.trim();
            data.description = data.description.trim();
            if (imageFile) {
                data.imageFile = imageFile;
            }
            http.put(`/tutorial/${id}`, data)
                .then((res) => {
                    console.log(res.data);
                    navigate('/tutorials');
                });
        }
    });

    const deleteTutorial = () => {
        http.delete(`/tutorial/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate('/tutorials');
            });
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Tutorial
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={8}>
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            label="Title"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                        <TextField
                            fullWidth
                            margin="normal"
                            autoComplete="off"
                            multiline
                            minRows={2}
                            label="Description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={4}>
                        <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button variant="contained" component="label">
                                Upload Image
                                <input hidden accept="image/*" type="file" onChange={onFileChange} />
                            </Button>
                            {imageFile && (
                                <Box sx={{ mt: 2 }}>
                                    <AspectRatio ratio={16 / 9}>
                                        <Box component="img" src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`} alt="Tutorial Image" />
                                    </AspectRatio>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
                <Box sx={{ mt: 2 }}>
                    <Button variant="contained" type="submit">
                        Update
                    </Button>
                    <Button variant="contained" sx={{ ml: 2 }} color="error" onClick={handleOpen}>
                        Delete
                    </Button>
                </Box>
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Tutorial</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this tutorial?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={deleteTutorial}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default EditTutorial;
