// import React, { useEffect, useState } from 'react';
// import Layout from '../Components/Layout/Layout';
// import { Container, Row, Col, Button }  from 'react-bootstrap';
// import '../Assets/styles/Aj/style.css'
// import axios from 'axios';
// import CountControl from '../Components/Shared/CountControl';

// const data = () => [

// {name:"AJ", age:"13"},
// {name:"AJA", age:"14"},
// {name:"AJB", age:"16"}


// ] 


// const Aj = () => {

//     const [Count, setCount]= useState(0);

//     const [Users, setUsers]= useState([]);

//     const addCount = (e) => {

//         setCount(Count + e)

//     }

//     const subtractCount = (e) => {

//         setCount(Count - e)

//     }

//     const resetCount = (e) => {

//         setCount(0)

//     }

//     const getUsers = async (e) => {
//         return await axios.get('https://reqres.in/api/users');
//     }

    
//     const postUser = async () => {
//         return await axios.post('https://reqres.in/api/users', user);
//     }

//     const putUser = async () => {
//         return await axios.put('https://reqres.in/api/users/'+userId, updatedUser);
//     }

//     const deleteUser = async (e) => {
//         return await axios.delete('https://reqres.in/api/users/'+userId);
//     }

//     const postUserSubmit = () => {
//         postUser(user).then(response => {
//             const success = response.data;
//             if (success) {
//                 alert("User has been added successfully")
//             }
//         }).catch((error) => {
//             console.log(error);
//         });
//     };

//     const putUserSubmit = () => {
//         putUser().then(response => {
//             const success = response.data;
//             if (success) {
//                 alert("User has been updated successfully")
//             }
//         }).catch((error) => {
//             console.log(error);
//         });
//     };
//     const deleteUserSubmit = () => {
//         deleteUser().then(response => {
//             const success = response.data;
//                 alert("User has been deleted successfully")
            
//         }).catch((error) => {
//             console.log(error);
//         });
//     };



//     useEffect(() => {
//         // ComponentDidMount logic goes here
//         // This will be executed after the component is mounted
//         // addCount();
//         getUsers().then(response => {
//             const selectedUsers = response.data.data;
//             if (selectedUsers) {
//                 setUsers(selectedUsers);
//             }
//             console.log(selectedUsers)
//         }).catch((error) => {
//             console.log(error);
//         });

//         return () => {
//             // ComponentWillUnmount logic goes here (optional)
//             // This will be executed before the component is unmounted
//             //   console.log('Component is unmounted');
//         };
//     }, []);


//   return (
//     <Layout>
//       <Container id="your-container-id" class="your-container-class">
//         <Row>
//           <Col md="12">
//             <h1>Aj Dampil</h1>
//             <h2 className={Count % 2 === 0 ? 'even' : ' odd '}>{Count}</h2>
//             {/* <h2 className={Count > 50 ? 'greater-than' : Count < 50 ? 'less-than' : 'equal-to'} >

//                 {Count >50 ? 'Count is    greater than 50' : Count < 50 ? 'Count is less than 50' : 'Count is equal to 50'}

//             </h2>
//             <h1 >The value of count is   <span className={Count % 2 === 0 ? 'even' : ' odd '} >{Count} </span>   </h1>
//             <Button className="btn-1" variant="primary" onClick={addCount}>Add 1</Button>
//             <Button className="btn-2" variant="danger" onClick={subtractCount}>Subtract 1</Button>
//             <Button className="btn-2" variant="warning" onClick={resetCount}>Reset</Button>

//             <h1>This is personCount  <span className={Count % 2 === 0 ? 'even' : ' odd '} >{Count} </span>  </h1> */}
//             {/* <Persons personCount = {Count}/> */}

//             <CountControl onaddCount = {(e)=> addCount(e)} onsubtractCount={(e)=> subtractCount(e)}/>
//             <Button variant="success" onClick={postUserSubmit}>Add</Button>
//                 {userId && userId != "" ?
//                     <>
//                         <Button variant="primary" onClick={putUserSubmit}>Update</Button>
//                         <Button variant="danger" onClick={deleteUserSubmit}>Delete</Button>
//                     </>
//                     :
//                     null
//                 }
        
//             <Col md="12">
//                 <table>
//                     <thead>
//                         <th>
                            
//                         </th>
//                         <th>
//                             Name
//                         </th>
//                         <th>
//                             Email
//                         </th>
//                     </thead>
//                 <tbody>
//                     {users && users.length > 0 ?
//                         <>
//                             {users.map(({ id, email, first_name, last_name, avatar }, index) => {
//                                 return (
//                                 <>
//                                     <tr key={index}>
//                                         <td><img src={avatar} style={{width: 50}} /></td>
//                                         <td>{first_name} {last_name}</td>
//                                         <td>{email}</td>
//                                         <td><Button variant="primary" onClick={() => setUserId(id)} >Set ID</Button></td>
//                                     </tr>
//                                 </>
//                                 );
//                             })}
//                         </>
//                         :
//                         <tr>
//                             <td colSpan={3}>
//                                 No records found.
//                             </td>
//                         </tr>
//                     }
//                     </tbody>
//                 </table>
// </Col>





//           </Col>
//         </Row>
//       </Container>
//     </Layout>
//   );
// };

// export default Aj;