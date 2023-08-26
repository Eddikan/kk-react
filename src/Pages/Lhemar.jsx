import React, { useEffect, useState } from 'react';
import Layout from 'Components/Layout/Layout';
import Lhemars from 'Components/Shared/Lhemars';
import { Container, Row, Col, Button }  from 'react-bootstrap';
import 'Assets/styles/Lhemar/style.css';
import axios from 'axios';

const About = () => {
    const [users, setUsers] = useState([]);
    const [userId, setUserId] = useState(''); 

    const data = [
        {name: 'Juriel', age: 18},
        {name: 'Jackie', age: 20},
        {name: 'Angel', age: 23}
    ];

    const user = {first_name: 'Jackie', last_name: 'Magnaye', email: 'jmagnaye.vb@gmail.com'};

    const updatedUser = {first_name: 'Juriel', last_name: 'Comia', email: 'jcomia.vb@gmail.com'};

    const [count, setCount] = useState(0);

    const AddCount = (e) => {
        setCount(count + e)
    }

    const SubstractCount = (e) => {
        setCount(count - e)
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
        return await axios.delete('https://reqres.in/api/users/'+userId);
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
        // ComponentDidMount logic goes here
        // This will be executed after the component is mounted
        // addCount();
        getUsers().then(response => {
            const selectedUsers = response.data.data;
            if (selectedUsers) {
                setUsers(selectedUsers);
            }
            console.log(selectedUsers)
        }).catch((error) => {
            console.log(error);
        });

        return () => {
            // ComponentWillUnmount logic goes here (optional)
            // This will be executed before the component is unmounted
            //   console.log('Component is unmounted');
        };
    }, []);

  return (
    <Layout>
      <Container id="your-container-id" class="your-container-class">
        <Row>
            <Col md="12">
            <h1>John Lhemar L. Costelo</h1>
            <h1>Web Developer</h1>
            <h1 className={
                count % 2 === 0 ?
                    'Even-Number'
                :
                    'Odd-Number'

            }>Count {count}</h1>

            <h1>
                {
                count >= 10 ?
                    'Count is greater than 10 :)'
                : count >= 5 ?
                    'Count is greater than to 5 but less than to 10 :|'
                : 
                    'Count is less than 5 :('
                }
            </h1>
            {/* <Lhemars personsCount={count}></Lhemars> */}
            <Lhemars onAddCount={(e) => AddCount(e)} onSubstractCount={(e) => SubstractCount(e)}></Lhemars>
            
            {/* <Button className="me-2" variant="primary" onClick={AddCount}>Lhemar Add ( + )</Button>
            <Button className="me-2" variant="danger" onClick={SubstractCount}>Lhemar Substract ( - )</Button> */}
                {/* <Persons personCount={count} /> */}
                <Button variant="success" onClick={postUserSubmit}>Add</Button>
                {userId && userId != "" ?
                    <>
                        <Button variant="primary" onClick={putUserSubmit}>Update</Button>
                        <Button variant="danger" onClick={deleteUserSubmit}>Delete</Button>
                    </>
                    :
                    null
                }
            </Col>
            <Col md="12">
                <table>
                    <thead>
                        <th>
                            
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Email
                        </th>
                    </thead>
                <tbody>
                    {users && users.length > 0 ?
                        <>
                            {users.map(({ id, email, first_name, last_name, avatar }, index) => {
                                return (
                                <>
                                    <tr key={index}>
                                        <td><img src={avatar} style={{width: 50}} /></td>
                                        <td>{first_name} {last_name}</td>
                                        <td>{email}</td>
                                        <td><Button variant="primary" onClick={() => setUserId(id)} >Set ID</Button></td>
                                    </tr>
                                </>
                                );
                            })}
                        </>
                        :
                        <tr>
                            <td colSpan={3}>
                                No records found.
                            </td>
                        </tr>
                    }
                    </tbody>
                </table>
            </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default About;

