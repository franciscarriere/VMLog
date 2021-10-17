import React, { Component } from 'react';
import { Grid, Label, Segment, Button, Image, Divider } from 'semantic-ui-react';
import axios from 'axios';

class AttachmentInput extends React.Component {
  
    constructor(props) {
        super(props);
        this.server = process.env.REACT_APP_API_URL || '';
    }

    uploadFile = event => {
        var uploadFiles = Array.from(event.target.files);
        var uploadURL = `${this.server}/api/attachments`
        var attachmentAddedCB = this.props.onAttachmentAdded

        uploadFiles.forEach(async function(file) {
            console.log(file)

            //Upload the file
            const formData = new FormData();
            formData.append('file', file)
            
            axios.post(uploadURL,
                formData,
                { headers: { 'content-type': 'multipart/form-data' } }
            ).then( data => {
                console.log('File uploaded.')
                attachmentAddedCB(event, data.data)
            }).catch(e => {
                    alert('Failed to upload attachment ' + file.name + '\n' + e)
                    console.log(e)
            })
        })
    }

    handleRemoveAttachmentClick(e) {
        e.preventDefault();
        this.props.onAttachmentRemoved(e, {attachmentId: e.target.getAttribute('data-attId')})
    }

    handleAddAttachmentClick(e) {
        e.preventDefault();

        //Open the File selector
        var event = new MouseEvent('click', {
            'view': window, 
            'bubbles': true, 
            'cancelable': false
        });
        var node = document.getElementById('file');
        node.dispatchEvent(event);
    }
    
    render() {
    const attachmentColumns = this.props.attachments.map( (att, i) =>
        <Grid.Column key={i}>
            <Image src={'http://localhost:3200/uploads/'+att} onError={(e)=>{e.target.onerror = null; e.target.src="http://localhost:3200/file-default.png"}} bordered />
            <Button negative circular size='mini' className="delAttachmentButton" data-attId={att} onClick={this.handleRemoveAttachmentClick.bind(this)} >X</Button>
        </Grid.Column>
     );

      return (        
        <div>
            <input type="file" id="file" name="filename" onChange={this.uploadFile} multiple hidden/>

            <Segment>
                <Label color='black' ribbon>
                Attachments
                </Label>    
            
                <Divider/>

                <Grid columns={4}>
                   {attachmentColumns}
                </Grid>

                <Divider/>
                
                <Button positive onClick={this.handleAddAttachmentClick}>Add Attachment</Button>
            </Segment>
            
        </div>
      );
    }
  }

  export default AttachmentInput