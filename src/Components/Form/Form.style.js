import styled from "styled-components";

// Material UI
import { Dialog } from "@material-ui/core";

export const FormWrapper = styled.div`
    width   : 80vw;
    margin  : 0 auto;

    .question-wrppaer {
        margin  : 15px 0;

        .question-container {
            .question {
                flex    : 1
            }
        }
    }

    .create-form-btn {
        margin-top  : 15px;
    }
`

export const AddQuestionModal = styled(Dialog)`
    .modal-header {
        margin  : 0
    }

    .form-name {
        margin-bottom   : 15px;

        .input-root {
            background-color    : #fff;

            :hover {
                background-color    : #fff;
            }
        }

        .input {
            padding : 15px 0;
        }
    }

    .type-select {
        margin-bottom   : 15px;
    }
`