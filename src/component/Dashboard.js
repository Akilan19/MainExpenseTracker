import React, {useEffect,useState} from 'react'
import '../config/firebase_config'
import firebase from "firebase/app"
import "firebase/auth"
import {showToast} from "../App";
import Console from "./Console";
import Login from "./Login";
import LinearProgress from "@material-ui/core/LinearProgress";

const Dashboard =props=>{

    const [auth,setAuth]=useState(true)
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                setAuth(true)
                firebase.firestore().collection('balance').doc(firebase.auth().currentUser.uid).get().then(doc=>{
                    if(!doc.exists)
                        firebase.firestore().collection('balance').doc(firebase.auth().currentUser.uid).set({
                            balance:0
                        }).then(()=>{
                            setLoading(false)
                        }).catch(err=>{
                            setLoading(false)
                            showToast(err.message)
                        })
                    else{
                        setLoading(false)
                    }

                }).catch(err=>{
                    setLoading(false)
                    showToast(err.message)
                })
            } else {
                setAuth(false)
                setLoading(false)
            }
        });
    },[])

    return(
        <div>
            {
                loading?(
                    <LinearProgress/>
                ):(
                    auth?(
                        <Console/>
                    ):(
                        <Login/>
                    )
                )
            }
        </div>
    )
}

export default Dashboard
