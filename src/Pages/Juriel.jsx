import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Juriel/juriel.css'
import JurielComponent from 'Components/Pages/Juriel/JurielComponent'
import axios from 'axios';

const Juriel = () => {
    const [count, setCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState('');
    // const [reloadCount, setReloadCount] = useState(true);

    const user = {first_name: 'Jackie', last_name: 'Magnaye', email: 'jmagnaye.vb@gmail.com'};
    const updatedUser = {first_name: 'Juriel', last_name: 'Comia', email: 'jcomia.vb@gmail.com'};

    const addCount = (e) => {
        setCount(count + e)
    }

    const subtractCount = (e) => {
        setCount(count - e)
    }

    const resetCount = (e) => {
        setCount(e)
    }

    const getUsers = async (e) => {
        return await axios.get('https://reqres.in/api/users');
    }

    const postUser = async () => {
        return await axios.post('https://reqres.in/api/users', user);
    }

    const putUser = async () => {
        return await axios.put('https://reqres.in/api/users/'+userId, updatedUser);
    }

    const deleteUser = async (e) => {
        return await axios.delete('https://reqres.in/api/users'+userId);
    }

    const postUserSubmit = () => {
        postUser(user).then(response => {
            const success = response.data;
            if (success) {
                alert("User has been added successfully")
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const putUserSubmit = () => {
        putUser().then(response => {
            const success = response.data;
            if (success) {
                alert("User has been updated successfully")
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const deleteUserSubmit = () => {
        deleteUser().then(response => {
            const success = response.data;
                alert("User has been deleted successfully")
            
        }).catch((error) => {
            console.log(error);
        });
    };


    useEffect(() => {
        getUsers().then(response => {
            const selectedUsers = response.data.data;
            if(selectedUsers) {
                setUsers(selectedUsers)
            }
            console.log(selectedUsers);
        }).catch((error) => {
            console.log(error)
        })
    }, [])

  return (
    <Layout>
        <Container id="your-container-id" className="your-container-class">
            <Row>
                <Col md="12">
                    <h1>Juriel</h1>
                    <JurielComponent count={count} 
                        onAddCount={(e) => addCount(e)} 
                        onSubtractCount={(e) => subtractCount(e)}
                        onResetCount={(e) => resetCount(e)}
                    />
                </Col>
                <Col>
                    <Button variant="success" onClick={postUserSubmit}>Add</Button>
                    {userId && userId != "" ?
                        <>
                            <Button variant="primary" onClick={putUserSubmit}>Update</Button>
                            <Button variant="danger" onClick={deleteUserSubmit}>Delete</Button>
                        </>
                        :
                        null
                    }

                    <table>
                        <thead>
                            <tr>
                                <th>Avatar</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users && users.length > 0 ?
                                <>
                                    {users.map((user, index) => (
                                        <>
                                            <tr key={index}>
                                                <td><img src={user.avatar} alt="" /></td>
                                                <td>{user.first_name}</td>
                                                <td>{user.last_name}</td>
                                                <td>{user.email}</td>
                                                <td><Button variant="primary" onClick={() => setUserId(user.id)} >Set ID</Button></td>
                                            </tr>
                                        </>
                                    ))}
                                </>
                                :
                                <>
                                    <p>No data</p>
                                </>
                            }
                        </tbody>
                    </table>
                </Col>
            </Row>
        </Container>
    </Layout>
  );
};

export default Juriel;