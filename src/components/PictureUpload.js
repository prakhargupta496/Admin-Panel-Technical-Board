import React from 'react';
import { Container, Button, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import firebase from '../Home/firebase';

const styles = {
    container: {
        textAlign: "center",
    },
    button: {
        fontSize: "20px",
        marginTop: "2vh",
        marginLeft: "1vw",
        marginRight: "1vw",
    },
    chips: {
        minWidth: 160,
        maxWidth: 210
    },
    chipContainer: {
        spacing: 1,
        direction: 'row'
    }
};

class PictureUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            uploadSuccess: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.uploadButton = this.uploadButton.bind(this);
        this.handleCloseUploadAlert = this.handleCloseUploadAlert.bind(this);
    }

    handleChange(newItems) {
        let items = this.state.items;

        newItems.forEach(newItem => {
            //Check if the Object is already there in the Array
            const duplicates = items.some(oldItem => {
                return (newItem.data === oldItem.data);
            });
            //If there are no duplicates then insert the element into the array
            if (!duplicates) {
                items.push(newItem);
            }
        });

        this.setState(state => ({
            items: items,
            uploadSuccess: this.state.uploadSuccess
        }));

        console.log(this.state.items);
    }

    uploadButton() {
        let items = this.state.items;

        for (let i = 0; i < items.length; i++) {
            this.uploadFile(items[i]);
        }
    }

    uploadFile(item) {
        //Get a reference to the storage service, which is used to create references in your storage bucket
        //Create a storage reference from storage service
        const storageRef = firebase.storage().ref('/gallery/');
        const imagesRef = storageRef.child(item.file.name);

        let data = this.base64Parser(item.data);

        imagesRef.putString(data, 'base64').then((snapshot) => {
            console.log('Uploaded a blob or file!');
            //TODO: Add some UI element to display if upload completed
        });
    }


    base64Parser(encodedStr) {
        return encodedStr.replace(/^data:image\/[a-z]+;base64,/, "");
    }

    async addInstaceToFirestore(item) {
        const db = firebase.firestore();

        const ref = db.collection('gallery');

        const res = await ref.add({
            ref: item.ref //Get location of uploaded file
        })
    }

    clearAll() {
        this.setState(state => ({
            items: [],
            uploadSuccess: state.uploadSuccess,
        }));
    }

    handleCloseUploadAlert() {
        this.setState(state => ({
            items: state.item,
            uploadSuccess: true,
        }));
    }

    render() {
        const { classes } = this.props;

        return (
            <Container maxWidth={false} className={classes.container}>
                <DropzoneAreaBase
                    filesLimit={1}
                    clearOnUnmount
                    onAdd={this.handleChange}
                />
                <Button className={classes.button} variant="contained" color="primary" onClick={this.uploadButton}>
                    Upload
                </Button>
                <Button className={classes.button} variant="contained" color="secondary" onClick={this.clearAll}>
                    Delete All
                </Button>
                {
                    this.state.uploadSuccess && (
                        <Snackbar
                            open={this.state.uploadSuccess}
                            autoHideDuration={6000}
                            onClose={this.handleCloseUploadAlert}
                        >
                            <Alert onClose={this.handleCloseUploadAlert} severity="success">
                                Your Image is Uploaded
                            </Alert>
                        </Snackbar>
                    )
                }
            </Container>
        );
    }
}

export default withStyles(styles)(PictureUpload);