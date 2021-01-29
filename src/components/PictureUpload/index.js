import React from 'react';
import { Container, Button } from '@material-ui/core';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Styles from './styles.module.css';
import firebase from '../../Home/firebase';

class PictureUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
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
                this.uploadFile(newItem.data);
                items.push(newItem);
            }
        });

        this.setState({
            items
        });

        console.log(this.state.items);
    }

    uploadFile(item){
        //Get a reference to the storage service, which is used to create references in your storage bucket
        //Create a storage reference from storage service

        const storageRef = firebase.storage().ref('/gallery/');
        const imagesRef = storageRef.child(item.file.name);

        // imagesRef.putString("", 'base64', {contentType: 'image/jpg'}).then((snapshot) => {
        //     console.log('Uploaded a blob or file!');
        // });


    }

    async addInstaceToFirestore(item){
        const db = firebase.firestore();

        const ref = db.collection('gallery');

        const res = await ref.add({
            ref: item.ref //Get location of uploaded file
        })
    }

    deleteAll() {
        this.setState({
            items: [],
        });
        console.log(this.state.items);
    }

    render() {
        return (
            <Container maxWidth={false} className={Styles.container}>
                <DropzoneAreaBase
                    filesLimit={10}
                    clearOnUnmount
                    onAdd={this.handleChange}
                />
                <Button className={Styles.button} variant="contained" color="primary">
                    Upload
                </Button>
                <Button className={Styles.button} variant="contained" color="secondary" onClick={this.deleteAll}>
                    Delete All
                </Button>
            </Container>
        );
    }
}

export default PictureUpload;