import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import { Box, Typography, Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import dayjs from 'dayjs';
import global from '../global';
import { Link } from 'react-router-dom';
import AspectRatio from '@mui/joy/AspectRatio';



function Tutorials() {
    const [tutorialList, setTutorialList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        http.get('/tutorial')
            .then((res) => {
                console.log(res.data);
                setTutorialList(res.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getTutorials = () => {
        http.get('/tutorial').then((res) => {
            setTutorialList(res.data);
        });
    };
    const searchTutorials = () => {
        http.get(`/tutorial?search=${search}`).then((res) => {
            setTutorialList(res.data);
        });
    };
    useEffect(() => {
        getTutorials();
    }, []);
    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchTutorials();
        }
    };
    const onClickSearch = () => {
        searchTutorials();
    }
    const onClickClear = () => {
        setSearch('');
        getTutorials();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Tutorials
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input
                    value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown}
                />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/addtutorial" style={{ textDecoration: 'none' }}>
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>
            <Grid container spacing={2}>
                {tutorialList.map((tutorial, i) => (
                    <Grid item key={i} xs={12} sm={6} md={4}>
                        <Card>{
                            tutorial.imageFile && (
                                <AspectRatio>
                                    <Box component="img"
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${tutorial.imageFile}`}
                                        alt="tutorial">
                                    </Box>
                                </AspectRatio>
                            )
                        }
                            <CardContent>
                                <Box sx={{ display: 'flex', mb: 1 }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        {tutorial.title}
                                    </Typography>
                                    {
                                        user && user.id === tutorial.userId && (
                                            <Link to={`/edittutorial/${tutorial.id}`}>
                                                <IconButton color="primary" sx={{ padding: '4px' }}>
                                                    <Edit />
                                                </IconButton>
                                            </Link>
                                        )
                                    }
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    color="text.secondary">
                                    <AccountCircle sx={{ mr: 1 }} />
                                    <Typography>
                                        {tutorial.user.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }} color="text.secondary">
                                    <AccessTime sx={{ mr: 1 }} />
                                    {dayjs(tutorial.createdAt).format(global.datetimeFormat)}
                                </Box>
                                <Typography variant="body2">{tutorial.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Tutorials;