import React, {useEffect, useState} from 'react'
import {Grid} from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import {showToast} from "../App";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    media: {
        height: 100,
        paddingTop: '100%', // 16:9
    },
    stepperRoot: {
        width: '100%',
    },
    canvasPaper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    },

    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(2,1),
    },
    root1:{
        height:'100%'
    },
    eliminationGrid : {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }
}));

const Day=props=>{

    const classes = useStyles();

    const [date,setDate]=useState(props.date)
    const [loading,setLoading]=useState(true)
    const [dataPoints,setDataPoints]=useState([])

    useEffect(()=>{
        setDate(props.date)
    },[props.date])

    useEffect(()=>{
        firebase.firestore().collection('transaction')
            .where('uid','==',firebase.auth().currentUser.uid)
            .where('year','==',date.getFullYear())
            .where('month','==',date.getMonth()+1)
            .where('date','==',date.getDate())
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

    const getTotal=()=>{
        var sum=0
        dataPoints.map(d=>{
            if(d.type===0)sum-=d.amount
            else sum+=d.amount
        })
        return sum
    }

    return(
        <div>
            {
                loading?(
                    <LinearProgress/>
                ):(
                    <Grid spacing={1} container>
                        {
                            loading?(
                                <div/>
                            ):(
                                <Grid style={{marginTop:'10px',marginBottom:'10px'}} item xs={12}>
                                    {
                                        getTotal()<0?(
                                            <div style={{fontSize:'1.6em', color:'#aa0000'}}>
                                                Total Today : ${getTotal()}/=
                                            </div>
                                        ):(
                                            <div style={{fontSize:'1.6em', color:'#00aa00'}}>
                                                Total Today : +${getTotal()}/=
                                            </div>
                                        )
                                    }
                                </Grid>
                            )
                        }
                        {
                            dataPoints.map(dataPoint=>{
                                return(
                                    <Grid style={{minHeight:'100%'}} item xs={6} md={2}>
                                        <Card className={classes.root1}>
                                            <CardActionArea>
                                                <CardContent>
                                                    {
                                                        dataPoint.type===0?(
                                                            <div style={{fontSize:'1.5em',color:'#aa0000'}}>
                                                                Cash Out
                                                            </div>
                                                        ):(
                                                            <div style={{fontSize:'1.5em',color:'#00aa00'}}>
                                                                Cash In
                                                            </div>
                                                        )
                                                    }
                                                    <center style={{marginTop:'20px'}}>
                                                        {
                                                            dataPoint.type===0?(
                                                                <div style={{fontSize:'2em',color:'#aa0000'}}>
                                                                    -${dataPoint.amount}/=
                                                                </div>
                                                            ):(
                                                                <div style={{fontSize:'2em',color:'#00aa00'}}>
                                                                   +${dataPoint.amount}/=
                                                                </div>
                                                            )
                                                        }
                                                    </center>
                                                    <Typography style={{marginTop:'20px'}} variant="body2" color="textSecondary" component="p">
                                                        - On {date.toLocaleString()}
                                                    </Typography>
                                                    {
                                                        dataPoint.type===0?(
                                                            <Typography  variant="body2" color="textSecondary" component="p">
                                                               -  Cause : {dataPoint.cause}
                                                            </Typography>
                                                        ):(
                                                            <div/>
                                                        )
                                                    }
                                                </CardContent>

                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
                )
            }
        </div>
    )
}

export default Day
