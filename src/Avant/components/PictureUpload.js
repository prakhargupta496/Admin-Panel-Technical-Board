import React from 'react';
import { Container, Button, Snackbar, TextField } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import firebase from '../firebase';

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
    },
    previewChip: {
        minWidth: 160,
        maxWidth: 210
    },
};

class PictureUpload extends React.Component {
    constructor(props) {
        super(props);
        
        
        this.state = {
            items: [],
            uploadSuccess: false,
            title: ""
        };
        
        
        //Functions to Update The States
        this.handleAdditions = this.handleAdditions.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.handleDeletion = this.handleDeletion.bind(this);
        this.handleName = this.handleName.bind(this);
        //Functions to Interact with the Database
        this.uploadFile = this.uploadFile.bind(this);
        this.uploadButton = this.uploadButton.bind(this);
        //Functions to handle Alerts
        this.handleCloseUploadAlert = this.handleCloseUploadAlert.bind(this);
        this.addRefToFirestore = this.addRefToFirestore.bind(this);
    }

    handleAdditions(newItems) {
        //TODO: Think of a way to upload multiple images
        //with changed names
        let items = [];

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

    handleDeletion(file, index) {
        //TODO: Change after implementing multiple file uploads
        this.setState(state => ({
            items: [],
            uploadSuccess: state.uploadSuccess,
        }));
    }

    handleName(event) {
        this.setState({title: event.target.value});
        //TODO: Find a efficient and maintainable way to edit the file name
    }

    uploadButton() {
        let items = this.state.items;

        for (let i = 0; i < items.length; i++) {
            this.uploadFile(items[i]);
        }
    }

    async uploadFile(item) {
        //Get a reference to the storage service, which is used to create references in your storage bucket
        //Create a storage reference from storage service
        const storageRef = firebase.storage().ref('/gallery/');
        const imagesRef = storageRef.child(item.file.name);

        let data = this.base64Parser(item.data);

        imagesRef.putString(data, 'base64').then((snapshot) => {
            console.log('Uploaded a blob or file!');
            this.addRefToFirestore(item, this.state.title);
            this.setState({uploadSuccess: true});
            setTimeout(() => {
                this.setState({
                    uploadSuccess: false,
                    items: [],
                    title: ""
                });
            }, 6000);
        });
        
    }


    base64Parser(encodedStr) {
        return encodedStr.replace(/^data:image\/[a-z]+;base64,/, "");
    }

    async addRefToFirestore(item, title) {
        const db = firebase.firestore();

        const ref = db.collection('gallery');

        let obj = {
            ref: `/gallery/${item.file.name}`,
            title
        }

        const res = await ref.add(obj)
        console.log("Updated firestore");
    }

    clearAll() {
        this.setState(state => ({
            items: [],
            uploadSuccess: state.uploadSuccess,
            title: ""
        }));
    }

    handleCloseUploadAlert() {
        this.setState(state => ({
            items: state.item,
            uploadSuccess: false,
        }));
    }

    render() {
        const { classes } = this.props;

        //TODO: Image Previews
        // const chipIcons = this.state.items.map(item => {
        //     return (<Avatar alt={item.file.name} src={item.data} />);
        // });

        return (
            <Container maxWidth={false} className={classes.container}>
                <DropzoneAreaBase
                    filesLimit={1}
                    clearOnUnmount
                    onAdd={this.handleAdditions}
                    onDelete={this.handleDeletion}
                    showPreviews
                    showPreviewsInDropzone={false}
                    useChipsForPreview
                    previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
                    previewChipProps={{
                        classes: { root: classes.previewChip },
                        //TODO: Implement the Avatar Feature
                        // avatar: chipIcons, 
                    }}
                    previewText="Selected Image"
                    fileObjects={this.state.items}
                />
                <form noValidate autoComplete="off">
                    <TextField id="standard-basic" label="Title of the Image" required onChange={this.handleName}/>
                </form>
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