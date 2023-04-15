import React, {useState} from 'react'
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import LinearProgress from "@material-ui/core/LinearProgress";
import firebase from "firebase/app"
import "firebase/auth"
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import {showToast} from "../App";
import "./Login.css"



const Login = props=>{

    const GButton = withStyles({
        root: {
            background: '#DB4437',
            borderRadius: 3,
            border: 0,
            color: 'white',
            height: 36,
            padding: '0 8px',
            boxShadow: '0 3px 8px 2px rgba(255, 105, 135, .3)',
        },
    })(Button);

    const [loading,setLoading]=useState(false)

    const googleAuth=()=> {
        setLoading(true)
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider).then(function (result) {
            setLoading(false)
        }).catch(function (error) {
            setLoading(false)
            showToast(error.message)
        });
    }

        return(
        <div>
            <Dialog open={true}>
                {
                    loading?(
                        <LinearProgress/>
                    ):(
                        <div/>
                    )
                }
                <DialogTitle>
                    <center>
                    <p>Welcome to</p>
                    </center>
                    <center>
                    <h1>Expense Tracker</h1>
                    <small>Every Penny Counts</small>
                    </center>
                   <center>
                   <br />
                   <br />
                    <GButton startIcon={<AssignmentIndIcon/>} onClick={googleAuth}  style={{marginTop:'5px',marginBottom:'8px'}} variant="contained" color="primary" >
                        Sign In using Google
                    </GButton>
                   </center>
                </DialogTitle>
            </Dialog>
        </div>
    )
}

export default Login
