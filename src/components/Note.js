import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import API from "../services/api";

class Note extends React.Component {
    state = {
        noteList: []
    };

    componentDidMount () {
        this.getNotes();
    }

    getNotes = () => {
        API.get("/note/getNotes")
            .then(response => {
                this.setState({
                    noteList: response.data.data.noteList
                });
            });
    }

    watchNoteTitle = (e, noteItem) => {
        noteItem.noteTitle = e.target.value;
        this.forceUpdate();
    }

    watchNoteContent = (e, noteItem) => {
        noteItem.noteContent = e.target.value;
        this.forceUpdate();
    }

    checkToSave = (e, noteItem) => {
        if (e.keyCode === 83 && e.metaKey) {
            e.preventDefault();
            this.updateNote(noteItem);
        }
    }

    createNote = () => {
        API.post("/note/createNote")
            .then(() => {
                toast.success("A new Note is created.");
                this.getNotes();
            });
    }

    updateNote = noteItem => {
        API.post("/note/updateNote", {
            noteId: noteItem.noteId,
            noteTitle: noteItem.noteTitle,
            noteContent: noteItem.noteContent
        })
            .then(() => {
                toast.success(`Note "${noteItem.noteTitle}" is updated.`);
                this.getNotes();
            });
    }

    archiveNote = noteItem => {
        API.post("/note/archiveNote", { noteId: noteItem.noteId })
            .then(() => {
                toast.success(`Note "${noteItem.noteTitle}" is archived.`);
                this.getNotes();
            });
    }

    render () {
        const noteList = this.state.noteList.length
            ? this.state.noteList.map(noteItem =>
                <div key={ noteItem.noteId }>
                    <hr />
                    <input type="text"
                        className="form-control"
                        placeholder="Untitled"
                        value={ noteItem.noteTitle }
                        onChange={ e => this.watchNoteTitle(e, noteItem) }
                        onKeyDown={ e => this.checkToSave(e, noteItem) }
                    />
                    <textarea className={`form-control mt-3 mb-3 noteContent ${this.props.hideEverything ? "hidingElement" : ""}`}
                        value={ noteItem.noteContent }
                        onChange={ e => this.watchNoteContent(e, noteItem) }
                        onKeyDown={ e => this.checkToSave(e, noteItem) }></textarea>
                    <p className="text-right">
                        <button className="btn btn-secondary" onClick={ () => this.archiveNote(noteItem) }>
                            <i className="fas fa-archive"></i> Archive
                        </button>
                        <button className="btn btn-primary" onClick={ () => this.updateNote(noteItem) }>
                            <i className="fas fa-save"></i> Save
                        </button>
                    </p>
                </div>
            )
            : <p className="alert alert-info">You don&apos;t have any notes yet.</p>;

        return (
            <section id="notes" className="col-12 col-lg-4">
                <h3>Notes</h3>
                <p className="text-muted">You can use <span className="badge badge-secondary">Ctrl/Cmd + S</span> to save your Notes.</p>
                <p className="text-right">
                    <button className="btn btn-primary"
                        onClick={ this.createNote }>
                        <i className="fas fa-plus"></i> New Note
                    </button>
                </p>
                { noteList }
            </section>
        );
    }
}

Note.propTypes = {
    hideEverything: PropTypes.bool.isRequired
};

// Map JData from Redux to this component
const mapStateToProps = state => state;

export default connect(mapStateToProps)(Note);
