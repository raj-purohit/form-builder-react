import React from 'react';
import { Switch, Route } from "react-router-dom";

// COMPONENTS
import FormList from "Components/Form/FormList";
import Form from "Components/Form";
import PreviewForm from "Components/Form/PreviewForm";

// ROUTING COMPONENTS
import { URL_FORM_LIST, URL_CREATE_FORM, URL_FORM } from "Helpers/Paths";

function Routes() {
    return (
        <Switch>
            <Route path={URL_FORM_LIST} exact component={FormList} />
            <Route path={`${URL_CREATE_FORM}/:id?`} component={Form} />
            <Route path={`${URL_FORM}/:id`} exact component={PreviewForm} />
        </Switch>
    );
}

export default Routes;
