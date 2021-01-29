import React from 'react';
import { Container, Button } from '@material-ui/core';
import { DropzoneAreaBase } from 'material-ui-dropzone';
import Styles from './styles.module.css';

class PictureUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
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

        this.setState({
            items
        });

        console.log(this.state.items);
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