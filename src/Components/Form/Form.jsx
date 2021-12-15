import React, { useEffect, useState } from "react";
import { useDispatch, useSelector }  from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment";

// Custom Component
import AddQuestion from "./AddQuestion";

// Style
import { FormWrapper } from "./Form.style";

// UI Component
import { Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Checkbox, IconButton } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiAlert from '@material-ui/lab/Alert';

// Redux Actions
import { addForm } from "Redux/Data/Actions";

// Common Function
import { RandomId } from "Helpers/Utils";

// Constants
import { QUESTION_TYPE, MULTIPLE_CHOICE_TYPE } from "Helpers/Constants";
import { URL_FORM_LIST } from "Helpers/Paths";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Form() {
    const dispatch = useDispatch()
    const history = useHistory();

    let { id } = useParams();

    let forms = useSelector(state => state.Data.forms)

    const [ form, setForm ] = useState({
        name        : "Untitled Form",
        questions   : []
    })
    const [ openQuestionModal, setOpenQuestionModal ] = useState(false)
    const [ editIndex, setEditIndex ] = useState(null)
    const [ editMode, setEditMode ] = useState(false)
    const [ error, setError ] = useState({
        open    : false,
        message : ""
    })

    useEffect(() => {
        if(id) {
            let findForm = forms.find(f => f.id === id)
            if(findForm) {
                setForm(findForm)
                setEditMode(true)
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const toogleModal = () => {
        setOpenQuestionModal(!openQuestionModal)
        
        if(editIndex)
            setEditIndex(null)
    }

    const handleFormTitle = (e) => {
        let newForm = {...form}
        newForm.name = e.target.value
        setForm(newForm)
    }

    const addQuestion = (question, editIndex) => {
        let newForm = {...form}

        if(editIndex === null) {
            newForm.questions.push(question)
        } else {
            newForm.questions.splice(editIndex, 1)
            newForm.questions.splice(editIndex, 0, question)
        }
        
        setForm(newForm)
        toogleModal()
        setError({
            open    : false,
            message : ""
        })
    }

    const deleteQuestion = (index) => {
        let newForm = {...form}

        newForm.questions.splice(index,1)
        
        setForm(newForm)
    }

    const editQuestion = (index) => {
        setEditIndex(index)
        toogleModal()
    }

    const createForm = () => {
        let newForms = JSON.parse(JSON.stringify(forms))
        
        if(form.name !== "") {
            if(form.questions.length === 0) {
                setError({
                    open    : true,
                    message : "Please add at least one question."
                })
            } else {
                if(!editMode) {
                    newForms.push({
                        id : RandomId(),
                        createdAt : moment().format("YYYY-MM-DD"),
                        ...form
                    })
                } else {
                    let formIndex = forms.findIndex(f => f.id === id)
                    if(formIndex !== -1) {
                        let formId = newForms[formIndex].id
                        newForms.splice(formIndex, 1)
                        newForms.splice(formIndex, 0, {
                            id : formId,
                            ...form
                        })
                    }
                }
                dispatch(addForm(newForms))
                history.push(URL_FORM_LIST)
            }
        }
    }


    return(
        <>
            <FormWrapper>
                {
                    error.open &&
                        <Alert severity="error">{error.message}</Alert>
                }
                <div className="header-wrapper">
                    <TextField
                        hiddenLabel
                        className="form-name"
                        value = {form.name}
                        variant="filled"
                        fullWidth
                        onChange={handleFormTitle}
                        error={!form.name}
                        helperText={!form.name ? "Form title is required!" : ""}
                        margin="normal"
                        placeholder="Add survey name"
                    />

                    <Button 
                        variant="contained" 
                        color = "primary"
                        onClick={toogleModal}
                    >
                        Add Question
                    </Button>

                    {
                        form.questions.length > 0 && 
                            form.questions.map((question,index) => (
                                <DisplayQuestion
                                    key             = {index}
                                    question        = {question}
                                    question_index  = {index}
                                    deleteQuestion  = {deleteQuestion}
                                    editQuestion    = {editQuestion}
                                    isRead          = {true}
                                />
                            ))
                    }
                </div>

                <Button 
                    variant="contained" 
                    color = "primary"
                    onClick={createForm}
                    className="create-form-btn"
                >
                    {!editMode ? "Create Form" : 'Update Form'}
                </Button>
            </FormWrapper>
            {
                openQuestionModal &&
                    <AddQuestion
                        open            = {openQuestionModal}
                        toogleModal     = {toogleModal}
                        handleSubmit    = {addQuestion}
                        editIndex = {editIndex}
                        editedQuestion  = {editIndex !== null ? form.questions[editIndex] : null}
                    />
            }
        </>
    )    
}


export function DisplayQuestion(props) {
    const { question, question_index, editQuestion, deleteQuestion, isRead } = props
    
    return (
        <>
            <div className="question-wrppaer">
                <div className="question-container flex f-v-center">
                    <div className="question">
                        { question.question }
                    </div>
                    {
                        isRead &&
                            <div className="action-wrapper">
                                <IconButton aria-label="delete" onClick={() => editQuestion(question_index)}>
                                    <EditIcon />
                                </IconButton> 
                                <IconButton aria-label="delete" onClick={() => deleteQuestion(question_index)}>
                                    <DeleteIcon />
                                </IconButton> 
                            </div>
                    }
                </div>
                <div className="option-wrapper">
                    <div className="option-container">
                        <Options question={question} isRead={isRead} />
                    </div>
                </div>
            </div>
        </>
    )    
}


function Options(props) {
    const { question, isRead } = props
    
    let types = {
        [QUESTION_TYPE.TEXT.TYPE] : function() {
            return(
                <TextField
                    hiddenLabel
                    className="form-name"
                    variant="filled"
                    fullWidth
                    margin="normal"
                    disabled = {isRead}
                    placeholder="Enter answer"
                />
            )
        },
        [QUESTION_TYPE.RADIO.TYPE] : function() {
            return(
                <FormControl>
                    <RadioGroup>
                        {
                            question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.ADD && 
                                <>
                                    {
                                        question.options.map((option, index) => (
                                            <FormControlLabel value={option.option} key={index} control={<Radio  disabled = {isRead}/>} label={option.option} />
                                        ))
                                    }
                                </>
                        }
                        {
                            question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.TEXTAREA && 
                                <>
                                    {
                                        question.optionText.split("\n").map((line,index) => (
                                            <>
                                            {
                                                line &&
                                                    <FormControlLabel value={line} key={index} control={<Radio  disabled = {isRead}/>} label={line} />
                                            }
                                            </>
                                        ))
                                    }
                                </>
                        }
                    </RadioGroup>
                </FormControl>
            )
        },
        [QUESTION_TYPE.CHECKBOX.TYPE] : function() {
            return(
                <FormControl>
                    <RadioGroup>
                        {
                            question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.ADD && 
                                <>
                                    {
                                        question.options.map((option, index) => (
                                            <FormControlLabel value={option.option} key={index} control={<Checkbox  disabled = {isRead}/>} label={option.option} />
                                        ))
                                    }
                                </>
                        }
                         {
                            question.multipleChoiceType === MULTIPLE_CHOICE_TYPE.TEXTAREA && 
                                <>
                                    {
                                        question.optionText.split("\n").map((line,index) => (
                                            <>
                                            {
                                                line &&
                                                    <FormControlLabel value={line} key={index} control={<Checkbox  disabled = {isRead}/>} label={line} />
                                            }
                                            </>
                                        ))
                                    }
                                </>
                        }
                    </RadioGroup>
                </FormControl>
            )
        },
    }

    return (types[question.type])()
}

export default Form