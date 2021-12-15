import React, { useEffect, useState} from "react";
import { useSelector }  from "react-redux";
import { useParams, useHistory } from "react-router-dom";

// Style
import { FormWrapper } from "./Form.style";

import { Button } from "@material-ui/core";

// Custom Components
import { DisplayQuestion } from "./Form";

import { URL_FORM_LIST } from "Helpers/Paths";

function PreviewForm(props) {
    const history = useHistory();
    let { id } = useParams();
    
    let forms = useSelector(state => state.Data.forms)
    
    const [ form, setForm ] = useState(null)

    useEffect(() => {
        if(id) {
            let findForm = forms.find(f => f.id === id)
            if(findForm) {
                setForm(findForm)
            } else {
                history.push(URL_FORM_LIST)
            }
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return(
        <FormWrapper>
            <Button 
                variant="contained" 
                color = "primary"
                onClick={() => history.push(URL_FORM_LIST)}
            >
                Back
            </Button>
            {
                form &&
                    <>
                        <h3>
                            {form.name}
                        </h3>
                        {                      
                            form.questions.map((question,index) => (
                                <DisplayQuestion
                                    key             = {index}
                                    question        = {question}
                                    question_index  = {index}
                                    isRead          = {false}
                                />
                            ))
                        }
                        <Button 
                            variant="contained" 
                            color = "primary"
                            className="create-form-btn"
                        >
                            Submit
                        </Button>
                    </>
            }
        </FormWrapper>

    )
}

export default PreviewForm;