import React, { Component } from 'react';
import { Grid, Label, Segment } from 'semantic-ui-react';
import axios from 'axios';

class AttachmentInput extends React.Component {
  
    constructor(props) {
        super(props);
        this.server = process.env.REACT_APP_API_URL || '';
    }

    uploadFile = event => {
        var uploadFiles = Array.from(event.target.files);
        var uploadURL = `${this.server}/api/attachments`

        uploadFiles.forEach(async function(file) {
            console.log(file)

            //Upload the file
            const formData = new FormData();
            formData.append('file', file)
            
            axios.post(uploadURL,
                formData,
                { headers: { 'content-type': 'multipart/form-data' } }
            ).then( data => {
                    console.log('file uploaded')
                    console.log(data)
                }).catch(e => {
                    alert('Failed to upload attachment ' + file.name + '\n' + e)
                    console.log(e)
                })
        })
    }
    
    render() {
      return (        
        <div>
            <Grid columns={1}>
                <Grid.Column>
                <Segment>
                    <Label color='black' ribbon>
                    Attachments
                    </Label>
                    
                    <input type="file" id="file" name="filename" onChange={this.uploadFile} multiple/>
                </Segment>
                </Grid.Column>
            </Grid>
        </div>
      );
    }
  }

  export default AttachmentInput