import React, { useState, useEffect } from "react";

// Style
import { AddQuestionModal } from "./Form.style";

// Material UI
import { FormControl, Select, MenuItem, TextField, Button, DialogContent, IconButton } from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';

// Constants
import { QUESTION_TYPE, MULTIPLE_CHOICE_TYPE } from "Helpers/Constants";

const TYPES = {
    QUESTION : "QUESTION",
    TYPE     : "TYPE",
    OPTION   : "OPTION",
    OPTION_TEXT : "OPTION_TEXT"
}

function AddQuestion(props) {
    const { open, toogleModal, editedQuestion, editIndex } = props
    
    const [ question, setQuestion ] = useState({
        question            : "Untitled Question",
        type                : QUESTION_TYPE.TEXT.TYPE,
        multipleChoiceType  : MULTIPLE_CHOICE_TYPE.ADD,
        options             : [],
        optionText          : "Untitle Option"
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
        } else if(type === TYPES.OPTION_TEXT) {
            newQuestion.optionText = e.target.value
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
        console.log("🚀 ~ file: AddQuestion.jsx ~ line 74 ~ handleSubmit ~ question", question)
        if(question.question !== "") {
            if(question.type === QUESTION_TYPE.RADIO.TYPE || question.type === QUESTION_TYPE.CHECKBOX.TYPE) {
                if(question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.ADD && question.options.length === 0)
                    return false

                if(question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.TEXTAREA && question.optionText === "")
                    return false

                if(question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.ADD) {
                    let emptyIndex = question.options.findIndex(o => o.option === "")
                    
                    if(emptyIndex !== -1)
                        return false
                }
            }
            props.handleSubmit(question, editIndex)
        }
    }

    const handleOptionType = (e) => {
        let newQuestion = {...question}
        newQuestion.multipleChoiceType = e.target.value
        console.log("🚀 ~ file: AddQuestion.jsx ~ line 95 ~ handleOptionType ~ e.target.value", e.target.value)
        setQuestion(newQuestion)
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
                    placeholder="Add Question"
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
                        <>
                            <FormControl fullWidth>
                                <Select
                                    className="type-select"
                                    value={question.multipleChoiceType}
                                    onChange={handleOptionType}
                                >
                                    <MenuItem value={MULTIPLE_CHOICE_TYPE.ADD}>
                                        Using Add Option
                                    </MenuItem>
                                    <MenuItem value={MULTIPLE_CHOICE_TYPE.TEXTAREA}>
                                        Using Textarea
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </>                       
                }

                {
                    (question.type !== QUESTION_TYPE.TEXT.TYPE && question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.ADD) &&
                        <Button
                            variant="contained" 
                            color = "primary"
                            onClick = {(e) => handleChange(e, TYPES.OPTION)}
                        >
                            Add Option
                        </Button>
                }

                {
                    (question.type !== QUESTION_TYPE.TEXT.TYPE && question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.TEXTAREA) &&
                        <TextField
                            className="form-name"
                            variant="filled"
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            value={question.optionText}
                            onChange={(e) => handleChange(e, TYPES.OPTION_TEXT)}
                            error={!question.optionText}
                            helperText={!question.optionText ? "Option Text is required!" : ""}
                        />
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
                                    placeholder="Add Question"
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