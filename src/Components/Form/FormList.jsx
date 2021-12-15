import React from "react";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { IconButton, Table, TableBody, TableCell, TableHead, TableRow, Button } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { URL_CREATE_FORM, URL_FORM } from "Helpers/Paths";
import { addForm } from "Redux/Data/Actions";

class FormList extends React.Component {
    editForm = (index) => {
        this.props.history.push(`${URL_CREATE_FORM}/${this.props.forms[index].id}`)
    }

    deleteForm = (index) => {
        let newForms = [...this.props.forms]
        newForms.splice(index, 1)
        this.props.addForm(newForms)
    }

    render() {
        return (
            <>
                <Button 
                    variant="contained" 
                    color = "primary"
                    onClick={() => this.props.history.push(URL_CREATE_FORM)}
                >
                    Create Form
                </Button>
                {
                    this.props.forms.length === 0 &&
                        <h1>
                            No forms available
                        </h1>
                }
                {
                    this.props.forms.length > 0 &&
                        <FormTable
                            forms = {this.props.forms}
                            editForm = {this.editForm}
                            deleteForm = {this.deleteForm}
                        />
                }

            </>
        )
    }
}

function FormTable(props) {
    return(
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        Form Name
                    </TableCell>
                    <TableCell>
                        Form URL
                    </TableCell>
                    <TableCell>
                        Created At
                    </TableCell>
                    <TableCell>
                        Actions
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    props.forms.map((form,index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {form.name}
                            </TableCell>
                            <TableCell>
                                <a href={`${process.env.REACT_APP_BASE_URL}${URL_FORM}/${form.id}`}>{`${process.env.REACT_APP_BASE_URL}${URL_FORM}/${form.id}`}</a>
                            </TableCell>
                            <TableCell>
                                {form.createdAt}
                            </TableCell>
                            <TableCell>
                            <IconButton aria-label="delete" onClick={() => props.editForm(index)}>
                                <EditIcon />
                            </IconButton> 
                            <IconButton aria-label="delete" onClick={() => props.deleteForm(index)}>
                                <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )    
}

const mapReduxStateToProps = (state) => ({
    forms     : state.Data.forms
})

export default connect(mapReduxStateToProps, {
    addForm
})(withRouter(FormList));
