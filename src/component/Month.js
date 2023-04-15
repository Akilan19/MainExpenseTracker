import React, {useEffect, useState} from 'react'
import firebase from "firebase";
import {showToast} from "../App";
import LinearProgress from "@material-ui/core/LinearProgress";
import DailyChart from "./DailyChart";

const Month=props=>{

    const [date,setDate]=useState(props.date)
    const [loading,setLoading]=useState(true)
    const [dataPoints,setDataPoints]=useState([])

    const [version,setVersion]=useState(props.version)

    useEffect(()=>{
        setDate(props.date)
    },[props.date])


    useEffect(()=>{
        setVersion(props.version)
    },[props.version])

    useEffect(()=>{
        console.log(dataPoints)
    },[dataPoints])

    useEffect(()=>{
        firebase.firestore().collection('transaction')
            .where('uid','==',firebase.auth().currentUser.uid)
            .where('year','==',date.getFullYear())
            .where('month','==',date.getMonth()+1)
            .orderBy('timestamp','desc')
            .get()
            .then(res=>{
                var data=[]
                res.docs.map(doc=>{
                    var currDoc=doc.data()
                    currDoc['id']=doc.id
                    data.push(currDoc)
                })
                setDataPoints(data)
                setLoading(false)
            }).catch(err=>{
            setLoading(false)
            console.log(err)
            showToast(err.message)
        })
    },[date,props.version])

    return(
        <div>
            {
                loading?(
                    <LinearProgress/>
                ):(
                    <div>
                        <DailyChart version={version} data={dataPoints} date={date} month={parseInt(date.getMonth()+1)}/>
                    </div>
                )
            }
        </div>
    )
}

export default Month
