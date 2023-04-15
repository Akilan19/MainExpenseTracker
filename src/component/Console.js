import React, {useEffect, useRef, useState} from 'react'
import {Button} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import WorkIcon from '@material-ui/icons/Work';
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "@material-ui/core/styles/useTheme";
import MenuIcon from '@material-ui/icons/Menu';
import deepPurple from "@material-ui/core/colors/deepPurple";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import EditIcon from '@material-ui/icons/Edit';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';
import DescriptionIcon from '@material-ui/icons/Description';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import LockIcon from '@material-ui/icons/Lock';
import CodeIcon from '@material-ui/icons/Code';
import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import {showToast} from "../App";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import LinearProgress from "@material-ui/core/LinearProgress";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import EventIcon from '@material-ui/icons/Event';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import Grid from "@material-ui/core/Grid";
import Day from "./Day";
import Month from "./Month";
import Year from "./Year";


const drawerWidth = 250;


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
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    stepperRoot: {
        width: '100%',
    },
    canvasPaper: {
        padding: theme.spacing(1),
        color: theme.palette.text.secondary,
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
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
    },
    purple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
}));

const Person=props=>{
    return(
        <Grid container>
            <Grid item xs={3}>
                <Avatar src={props.image}/>
            </Grid>
            <Grid item xs={8}>
                <div style={{fontSize:'1.2em'}}>
                    {props.name}
                </div>
                <div style={{fontSize:'1.2em'}}>
                    {props.email}
                </div>
            </Grid>

        </Grid>
    )
}

const Console=props=>{

    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [menu,setMenu]=useState(1)

    const [balance,setBalance]=useState(null)

    const [date,setDate]=useState(new Date())

    const [addDialog,setAddDialog]=useState(false)
    const [addLoading,setAddLoading]=useState(false)

    const [version,setVersion]=useState(Date.now())

    const [withdrawDialog,setWithdrawDialog]=useState(false)
    const [withdrawLoading,setWithdrawLoading]=useState(false)


    const [devDialog,setDevDialog]=useState(false)

    const amountRef=useRef()
    const causeRef=useRef()

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const container = window !== undefined ? () => window().document.body : undefined;


    const logoutClick=()=>{
        firebase.auth().signOut()
    }





    const syncBalance=()=>{
        firebase.firestore().collection('balance').doc(firebase.auth().currentUser.uid).get().then(doc=>{
            if(doc.exists){
                setBalance(doc.data().balance)
            }
            else{
                syncBalance()
            }
        })
    }

    const addClick=()=>{
        const amount=amountRef.current.value
        if(amount<=0)
            showToast('Invalid cash in amount')
        else{
            setAddLoading(true)
            firebase.firestore().collection('transaction').add({
                timestamp:Date.now(),
                year:date.getFullYear(),
                month:date.getMonth()+1,
                date:date.getDate(),
                type:1,
                amount:parseFloat(amount),
                uid:firebase.auth().currentUser.uid
            }).then(()=>{
                firebase.firestore().collection('balance').doc(firebase.auth().currentUser.uid).update({
                    balance:firebase.firestore.FieldValue.increment(parseFloat(amount))
                }).then(()=>{
                    setAddLoading(false)
                    setAddDialog(false)
                    showToast(`$${amount}/= added to your wallet`)
                    syncBalance()
                    setVersion(Date.now())
                }).catch(err=>{
                    setAddLoading(false)
                    showToast(err.message)
                })
            }).catch(err=>{
                setAddLoading(false)
                showToast(err.message)
            })
        }
    }

    const withdrawClick=()=>{
        const amount=amountRef.current.value
        const cause=causeRef.current.value
        if(amount<=0)
            showToast('Invalid withdraw amount')
        else if(cause.length===0)
            showToast('Please enter cause of withdrawal')
        else{
            setWithdrawLoading(true)
            firebase.firestore().collection('transaction').add({
                timestamp:Date.now(),
                year:date.getFullYear(),
                month:date.getMonth()+1,
                date:date.getDate(),
                type:0,
                amount:parseFloat(amount),
                uid:firebase.auth().currentUser.uid,
                cause:cause
            }).then(()=>{
                firebase.firestore().collection('balance').doc(firebase.auth().currentUser.uid).update({
                    balance:firebase.firestore.FieldValue.increment(-parseFloat(amount))
                }).then(()=>{
                    setWithdrawLoading(false)
                    setWithdrawDialog(false)
                    showToast(`$${amount}/= withdrawed from your wallet`)
                    syncBalance()
                    setVersion(Date.now())
                }).catch(err=>{
                    setWithdrawLoading(false)
                    showToast(err.message)
                })
            }).catch(err=>{
                setWithdrawLoading(false)
                showToast(err.message)
            })
        }
    }


    useEffect(()=>{
        showToast(`Welcome ${firebase.auth().currentUser.displayName}`)
        syncBalance()
    },[])

    const drawer = (
        <div style={{padding:'10px'}}>
            <center>
                <div style={{marginTop:'6px'}}>
                    <Button
                        style={{marginLeft:'5px'}}
                        variant={'outlined'}
                        onClick={logoutClick}
                        startIcon={<ExitToAppIcon/>}
                        color={'secondary'}>
                        Logout
                    </Button>
                </div>
            </center>
            <center>
                <Avatar src={firebase.auth().currentUser.photoURL} style={{width:'80px',height:'80px',marginTop:'20px'}} className={classes.purple}>
                    {firebase.auth().currentUser.displayName.substr(0,1)}
                </Avatar>

            </center>
            <center>
                <div style={{marginTop:'20px',fontSize:'1.2em'}}>
                    {firebase.auth().currentUser.displayName}
                </div>
            </center>
            <center>
                <div style={{marginTop:'20px',fontSize:'2.5em',color:'#0090ff'}}>
                    {
                        balance===null?(
                            <div>
                                ...
                            </div>
                        ):(
                            balance>0?(
                                <div>
                                    ${balance}/=
                                </div>
                            ):(
                                <div style={{color:'#aa0000'}}>
                                    ${balance}/=
                                </div>
                            )

                        )
                    }
                </div>
            </center>

            <center>
                <div style={{marginTop:'20px'}}>
                    <Button
                        variant={'outlined'}
                        color={'primary'}
                        onClick={()=>{setAddDialog(true)}}
                        startIcon={<AddBoxIcon/>}>

                        In

                    </Button>

                    <Button
                        variant={'outlined'}
                        color={'secondary'}
                        onClick={()=>{setWithdrawDialog(true)}}
                        style={{marginLeft:'5px'}}
                        startIcon={<IndeterminateCheckBoxIcon/>}>

                        Out

                    </Button>
                </div>
            </center>
            <List style={{marginTop:'20px'}}>
                <ListItem selected={menu==1} onClick={()=>{setMenu(1)}} button>
                    <ListItemIcon><AccessAlarmIcon /> </ListItemIcon>
                    <ListItemText primary={'Today'} />
                </ListItem>
                <ListItem selected={menu==2} onClick={()=>{setMenu(2)}} button>
                    <ListItemIcon><EventIcon /> </ListItemIcon>
                    <ListItemText primary={'This Month'} />
                </ListItem>
                <ListItem selected={menu==3} onClick={()=>{setMenu(3)}} button>
                    <ListItemIcon><AcUnitIcon /> </ListItemIcon>
                    <ListItemText primary={'This Year'} />
                </ListItem>
            </List>
            <div style={{bottom:0,position:'absolute'}}>
            </div>
        </div>
    );

    return(
        <div className={classes.root}>

            <Dialog open={devDialog} fullWidth>
                <DialogTitle>
                    Developers
                </DialogTitle>

                <DialogContent fullWidth>
                    <Person
                        image={'https://buet-edu-1.s3.amazonaws.com/auto_upload/0RMFi9mrPNe7mol2JwcZAf40F3n2/1618752944112.jpg'}
                        name={'Md. Samirul Alam'}
                        email={'samirul1919@cseku.ac.bd'}
                    />
                    <Divider style={{marginTop:'10px',marginBottom:'10px'}}/>
                    <Person
                        image={'https://buet-edu-1.s3.amazonaws.com/auto_upload/0RMFi9mrPNe7mol2JwcZAf40F3n2/1618752976128.jpg'}
                        name={'Md. Mehrab Haque'}
                        email={'1805001@ugrad.cse.buet.ac.bd'}
                    />
                </DialogContent>

                <DialogActions>
                    <Button
                        onClick={()=>{setDevDialog(false)}}
                        color={'secondary'}>
                        Close
                    </Button>
                </DialogActions>

            </Dialog>


            <Dialog open={addDialog}>
                {
                    addLoading?(
                        <LinearProgress/>
                    ):(
                        <div/>
                    )
                }
                <DialogTitle>
                    Cash In
                </DialogTitle>
                <DialogContent>
                    <TextField
                        inputRef={amountRef}
                        variant={'outlined'}
                        type={'number'}
                        label={'Amount ($)'}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={addLoading}
                        onClick={()=>{setAddDialog(false)}}
                        color={'secondary'}>
                        Cancel
                    </Button>
                    <Button
                        disabled={addLoading}
                        onClick={addClick}
                        color={'primary'}>
                        Cash In
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={withdrawDialog}>
                {
                    withdrawLoading?(
                        <LinearProgress/>
                    ):(
                        <div/>
                    )
                }
                <DialogTitle>
                    Withdraw
                </DialogTitle>
                <DialogContent>
                    <center>
                    <TextField
                        inputRef={amountRef}
                        variant={'outlined'}
                        type={'number'}
                        label={'Amount ($)'}
                    />
                    <br/>
                        <br/>
                    <TextField
                        inputRef={causeRef}
                        variant={'outlined'}
                        multiline
                        rows={2}
                        label={'Cause'}
                    />
                    </center>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={withdrawLoading}
                        onClick={()=>{setWithdrawDialog(false)}}
                        color={'secondary'}>
                        Cancel
                    </Button>
                    <Button
                        disabled={withdrawLoading}
                        onClick={withdrawClick}
                        color={'primary'}>
                        Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
            <CssBaseline />
            <AppBar  style={{backgroundColor:'#0090ff',color:'#ffffff'}}  className={classes.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                    >
                        <WorkIcon />
                    </IconButton>

                    <Typography variant="h6" noWrap>
                        Expense Tracker
                    </Typography>
                    <div  style={{position:'absolute',right:'10px',display:'flex'}}>
                        <IconButton
                            onClick={handleClick}
                            color="inherit"
                        >
                            <MoreVertIcon/>
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                        >
                            <MenuItem onClick={logoutClick}>Logout</MenuItem>
                        </Menu>
                    </div>

                </Toolbar>
                <Divider/>
            </AppBar>
            <nav className={classes.drawer} aria-label="mailbox folders">
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true, // Better open performance on mobile.
                        }}
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        {drawer}
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <div className={classes.toolbar} />
                <Grid container>
                    <Grid item xs={12}>
                        <DatePicker dateFormat="dd/MM/yyyy" selected={date} inline onChange={d => setDate(d)} />
                    </Grid>
                    <Grid item xs={12}>
                        {
                            menu===1?(
                                <Day date={date} version={version}/>
                            ):(
                                menu===2?(
                                    <Month date={date} version={version}/>
                                ):(
                                    menu===3?(
                                        <Year date={date} version={version}/>
                                    ):(
                                        <div/>
                                    )
                                )
                            )
                        }

                    </Grid>
                </Grid>

            </main>
        </div>
    )
}


export default Console
