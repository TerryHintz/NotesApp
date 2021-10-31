import React, { Component } from 'react';
import './App.css';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const sampleNotes = [
  {
    title: "Title",
    subNotes: [
      "Note 1",
      "Note 2"
    ]
  },
]

class Notes extends Component {

  state = {
    notes: [],
    expandedPanel: -1,
    dialog: false,
    editingTitle: '',
    editingNote: '',
    editingIndex: -1,
    editingSubIndex: -1,
  }

  componentDidMount() {
    const notesStr = localStorage.getItem("notes");
    const notes = JSON.parse(notesStr) || sampleNotes;
    this.setState({notes});
  }

  handleAccordionClick = (index) => {
    this.setState({expandedPanel: index});
  }

  handleAddSubNote = (index) => {
    const title = this.state.notes[index].title;
    this.setState({editingTitle: title, editingNote: "", editingIndex: index, editingSubIndex: -1, dialog: true});
  }

  handleAddNote = () => {
    this.setState({editingTitle: "", editingNote: "", editingIndex: -1, editingSubIndex: -1, dialog: true});
  }

  handleSubNoteClick = (subNote) => {
    navigator.clipboard.writeText(subNote);
  }

  handleSubNoteDoubleClick = (subNote, index, subIndex) => {
    const title = this.state.notes[index].title;
    this.setState({editingTitle: title, editingNote: subNote, editingIndex: index, editingSubIndex: subIndex, dialog: true});
  }

  handleDialogClose = () => {
    this.setState({dialog: false});
  }

  handleNoteSave = () => {
    const { notes, editingIndex, editingSubIndex } = this.state;
    const notesCopy = notes;
    const updatedNote = document.getElementById("editing-note").value;
    const updatedTitle = document.getElementById("editing-title").value;
    if(editingIndex >= 0) {
      notesCopy[editingIndex].title = updatedTitle;
      if(editingSubIndex >= 0) {
        notesCopy[editingIndex].subNotes[editingSubIndex] = updatedNote;
      } else {
        notesCopy[editingIndex].subNotes.push(updatedNote);
      }
    } else {
      const note = {
        title: updatedTitle,
        subNotes: [updatedNote],
      }
      notesCopy.push(note);
    }
    this.setState({notes: notesCopy, dialog: false});
    const notesStr = JSON.stringify(notesCopy);
    localStorage.setItem("notes", notesStr);
  }

  handleDeleteAccordion = (index) => {
    const notesCopy = this.state.notes;
    notesCopy.splice(index, 1);
    this.setState({notes: notesCopy, dialog: false});
    const notesStr = JSON.stringify(notesCopy);
    localStorage.setItem("notes", notesStr);
  }

  handleDeleteSubNote = (index, subIndex) => {
    const notesCopy = this.state.notes;
    notesCopy[index].subNotes.splice(subIndex, 1);
    this.setState({notes: notesCopy, dialog: false});
    const notesStr = JSON.stringify(notesCopy);
    localStorage.setItem("notes", notesStr);
  }

  render() {
    return (
      <div className="notes-root">
        {this.state.notes.map((note, index) => {
            return (
              <Accordion
                expanded={this.state.expandedPanel === index}
                onClick={() => this.handleAccordionClick(index)}
              >
                <AccordionSummary>
                  <div style={{fontSize: '25px', fontWeight: '600', width: '100%'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                      <div>{note.title}</div>
                      <div>
                        <Button onClick={() => this.handleAddSubNote(index)}>Add</Button>
                        <Button onDoubleClick={() => this.handleDeleteAccordion(index)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{display: 'block'}}>
                  {note.subNotes.map((subNote, subIndex) => {
                    return (
                      <div
                        style={{display: 'flex', justifyContent: 'space-between', wordBreak: 'break-word', cursor: 'pointer', fontSize: '20px', padding: '10px 0 10px 0'}}
                        onClick={() => this.handleSubNoteClick(subNote)}
                        onDoubleClick={() => this.handleSubNoteDoubleClick(subNote, index, subIndex)}
                      >
                        <div>{subNote}</div>
                        <Button onClick={() => this.handleDeleteSubNote(index, subIndex)}>Delete</Button>
                      </div>
                    )
                  })}
                </AccordionDetails>
              </Accordion>
            )
        })}
        <div style={{display: 'flex', justifyContent: 'center', backgroundColor: 'white', marginTop: '10px'}}>
          <Button
            style={{ width: '100%' }}
            onClick={() => this.handleAddNote()}
          >Add</Button>
        </div>
        <Dialog open={this.state.dialog} onClose={this.handleDialogClose}>
          <DialogTitle>Add or Edit Note</DialogTitle>
          <DialogContent>
          <TextField
            id="editing-title"
            style={{ width: 506, marginBottom: '10px' }}
            variant="outlined"
            defaultValue={this.state.editingTitle}
          />
          <TextareaAutosize
            id="editing-note"
            minRows={10}
            style={{ width: 500 }}
            defaultValue={this.state.editingNote}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.handleNoteSave()}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Notes;
