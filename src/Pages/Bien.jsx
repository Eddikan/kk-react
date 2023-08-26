import React, { useState, useEffect } from 'react';
import Layout from '../Components/Layout/Layout';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'Assets/styles/About/style.css';
import Count from '../Components/Pages/Bien/Count';
import CountControls from '../Components/Shared/CountControls';
import axios from 'axios';

const Bien = () => {
    const [count, setCount] = useState(0);

    const addCount = (e) => {
        setCount(count + e)
    }
    
    const subtractCount = (e) => {
        setCount(count - e)
    }

    const multiplyCount = (e) => {
        setCount(count * e)
    }

    const divideCount = (e) => {
        setCount(count / e)
    }

    const resetCount = (e) => {
        setCount(e)
    }

    const getUsers = async (e) => {
        return await axios.get('')
    }

    const postUsers = async (e) => {
        return await axios.post('')
    }

    const updateUsers = async (e) => {
        return await axios.put('')
    }

    const deleteUsers = async (e) => {
        return await axios.get('')
    }

    useEffect(() => {
        getUsers().then(response => {
            const selectedUsers = response.data.data;
            if (selectedUsers) {

            }
        }).catch((error) => {
            
        })
    }

    )

    return (
        <Layout>
        <Container>
            <Row>
                <h1>Yo wassup mga idols</h1>
                <Count count={count}></Count>
                <CountControls onAddCount={(e) => addCount(e)} onSubtractCount={(e) => subtractCount(e)} onMultiplyCount={(e) => multiplyCount(e)} onDivideCount={(e) => divideCount(e)} onResetCount={(e) => resetCount(e)}></CountControls>
                <p>Hulaan mo kung ilan tao na ako, nandito clue:</p>
                {count < 23 ?
                    <p>Dagdage pa</p> 
                    : count === 23 ?
                    <p>Yan tama na</p>
                    : 
                    <p>Bawase at sobra na</p>
                }
            </Row>
        </Container>
        </Layout>
    );
};

export default Bien;