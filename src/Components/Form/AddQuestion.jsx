import React, { useState, useEffect } from "react";

// Style
import { AddQuestionModal } from "./Form.style";

// Material UI
import { FormControl, Select, MenuItem, TextField, Button, DialogContent, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

// Constants
import { QUESTION_TYPE } from "Helpers/Constants";

const TYPES = {
    QUESTION : "QUESTION",
    TYPE     : "TYPE",
    OPTION   : "OPTION"
}

function AddQuestion(props) {
    const { open, toogleModal, editedQuestion, editIndex } = props
    
    const [ question, setQuestion ] = useState({
        question : "Untitled Question",
        type     : QUESTION_TYPE.TEXT.TYPE,
        options  : []
    })
    const [ editMode, setEditMode ] = useState(false)
    
    useEffect(() => {        
        if(editedQuestion) {
            setQuestion(editedQuestion)
            setEditMode(true)
        }
    }, [editedQuestion])

    const handleChange = (e, type, option_index = "") => {
        let newQuestion = {...question}

        if(type === TYPES.QUESTION) {
            newQuestion.question = e.target.value
        } else if(type === TYPES.TYPE) {
            newQuestion.type = e.target.value

            if(type === QUESTION_TYPE.TEXT.TYPE)
                newQuestion.options = []
        } else if(type === TYPES.OPTION) {
            if(option_index === "") {
                newQuestion.options.push({
                    option : "Untitled Option"
                })
            } else {
                newQuestion.options[option_index].option = e.target.value
            }
        }

        setQuestion(newQuestion)
    }

    const deleteOption = (index) => {
        let newQuestion = {...question}
        newQuestion.options.splice(index, 1)
        setQuestion(newQuestion)
    }

    const handleSubmit = () => {
        if(question.question !== "") {
            if(question.type === QUESTION_TYPE.RADIO.TYPE || question.type === QUESTION_TYPE.CHECKBOX.TYPE) {
                if(question.options.length === 0)
                    return false


                let emptyIndex = question.options.findIndex(o => o.option === "")
                
                if(emptyIndex !== -1)
                    return false
            }
            props.handleSubmit(question, editIndex)
        }
    }

    return(
        <AddQuestionModal
            open        = {open}
            onClose     = {toogleModal}
            scroll      = "body"
            maxWidth    = "sm"
            fullWidth
        >
            <DialogContent>
                <h3 className="modal-header">
                    {`${!editMode ? "Add" : "Edit"} Question`}
                </h3>

                <TextField
                    hiddenLabel
                    className="form-name"
                    InputProps = {{
                        classes : {
                            input : "input",
                            root  : "input-root"
                        }
                    }}
                    value={question.question}
                    onChange={(e) => handleChange(e, TYPES.QUESTION)}
                    variant="filled"
                    fullWidth
                    margin="normal"
                    error={!question.question}
                    helperText={!question.question ? "Question is required!" : ""}
                />

                <FormControl fullWidth>
                    <Select
                        className="type-select"
                        value={question.type}
                        onChange={(e) => handleChange(e, TYPES.TYPE)}
                    >
                        {
                            Object.entries(QUESTION_TYPE).map(([key, type]) => (
                                <MenuItem key={key} value={type.TYPE}>
                                    {type.NAME}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
                
                {
                    question.type !== QUESTION_TYPE.TEXT.TYPE &&                        
                        <Button
                            variant="contained" 
                            color = "primary"
                            onClick = {(e) => handleChange(e, TYPES.OPTION)}
                        >
                            Add Option
                        </Button>
                }

                {
                    (question.type !== QUESTION_TYPE.TEXT.TYPE && question.options.length > 0) &&
                        question.options.map((option,index) => (
                            <div key={index} className="option-wrapper flex f-v-center f-h-center">
                                <TextField
                                    key = {index}
                                    hiddenLabel
                                    className="form-name"
                                    classes={
                                        { root : "textfield-root"}
                                    }
                                    InputProps = {{
                                        classes : {
                                            input : "input",
                                            root  : "input-root"
                                        }
                                    }}
                                    value={option.option}
                                    onChange={(e) => handleChange(e, TYPES.OPTION, index)}
                                    variant="filled"
                                    fullWidth
                                    margin="normal"
                                    error={!option.option}
                                    helperText={!option.option ? "Option is required!" : ""}
                                /> 
                                <IconButton aria-label="delete" onClick={() => deleteOption(index)}>
                                    <DeleteIcon />
                                </IconButton> 
                            </div>

                        ))
                }

                <div style={{margin : "15px 0"}}>
                    <Button 
                        variant="contained" 
                        color = "primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
            </DialogContent>
        </AddQuestionModal>
    )
}

export default AddQuestion